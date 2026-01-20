import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Verifying remote data...');
    const userCount = await prisma.user.count();
    const estateCount = await prisma.estate.count();
    const assetCount = await prisma.asset.count();
    console.log(`Users: ${userCount}`);
    console.log(`Estates: ${estateCount}`);
    console.log(`Assets: ${assetCount}`);
    const user = await prisma.user.findFirst({ include: { estates: true } });
    console.log('Sample User:', user?.email);
    console.log('Sample Estate:', user?.estates[0]?.name);
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=verify_db.js.map