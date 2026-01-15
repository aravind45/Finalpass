
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create a User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            name: 'Demo External',
            passwordHash: hashedPassword,
            role: 'EXECUTOR',
            state: 'CA',
        },
    });
    console.log(`Created user: ${user.name}`);

    // 2. Create an Estate
    const estate = await prisma.estate.create({
        data: {
            name: 'Estate of John Doe',
            userId: user.id,
            status: 'ACTIVE',
            deceasedInfo: JSON.stringify({
                name: 'John Doe',
                dateOfDeath: '2025-12-15',
                ssn: '***-**-6789'
            }),
            complexityScore: 5
        }
    });
    console.log(`Created estate: ${estate.name}`);

    // 3. Create Stakeholders (Beneficiaries)
    await prisma.stakeholder.createMany({
        data: [
            {
                estateId: estate.id,
                type: 'BENEFICIARY',
                info: JSON.stringify({ name: 'Jane Doe', relation: 'Spouse', email: 'jane@example.com' }),
                permissions: '["VIEW_UPDATES"]'
            },
            {
                estateId: estate.id,
                type: 'BENEFICIARY',
                info: JSON.stringify({ name: 'Jimmy Doe', relation: 'Son', email: 'jimmy@example.com' }),
                permissions: '["VIEW_UPDATES"]'
            }
        ]
    });
    console.log('Created stakeholders');

    // 4. Create Assets
    await prisma.asset.createMany({
        data: [
            {
                estateId: estate.id,
                type: 'BankAccount',
                institution: 'Chase Bank',
                status: 'DISCOVERED',
                value: 15000.50,
                requirements: JSON.stringify(['Death Certificate', 'Letters Testamentary']),
                metadata: JSON.stringify({ accountLast4: '1234' })
            },
            {
                estateId: estate.id,
                type: 'InvestmentAccount',
                institution: 'Fidelity',
                status: 'IN_PROGRESS',
                value: 250000.00,
                requirements: JSON.stringify(['Medallion Signature Guarantee']),
                metadata: JSON.stringify({ accountLast4: '5678' })
            },
            {
                estateId: estate.id,
                type: 'RealEstate',
                institution: 'County Recorder',
                status: 'OPEN',
                value: 850000.00,
                requirements: JSON.stringify(['Affidavit of Death']),
                metadata: JSON.stringify({ address: '123 Maple St' })
            }
        ]
    });
    console.log('Created assets');

    // 5. Create Documents
    await prisma.document.create({
        data: {
            estateId: estate.id,
            type: 'DEATH_CERTIFICATE',
            fileName: 'death_cert_john_doe.pdf',
            filePath: '/uploads/dc_johndoe.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
            status: 'VERIFIED',
            extractedData: JSON.stringify({ verified: true, date: '2025-12-20' })
        }
    });
    console.log('Created documents');

    // 6. Create Communications
    await prisma.communication.create({
        data: {
            estateId: estate.id,
            channel: 'EMAIL',
            status: 'SENT',
            content: 'Initial inquiry sent to Chase Bank compliant dept.',
            auditTrail: JSON.stringify({ sentAt: new Date() }),
            metadata: JSON.stringify({ recipient: 'complaints@chase.com' })
        }
    });
    console.log('Created communication logs');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
