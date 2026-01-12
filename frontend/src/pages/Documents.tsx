import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Document {
    id: string;
    name: string;
    category: 'legal' | 'financial' | 'tax';
    status: 'have' | 'missing' | 'pending';
    required: boolean;
    institution?: string;
    howToObtain?: {
        method: string;
        contact?: string;
        url?: string;
        estimatedTime?: string;
        tips?: string[];
    };
}

const Documents = () => {
    const navigate = useNavigate();
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    // Mock data - in production, this would come from the backend based on discovered assets
    const documents: Document[] = [
        {
            id: '1',
            name: 'Death Certificate (Certified Copy)',
            category: 'legal',
            status: 'have',
            required: true,
            howToObtain: {
                method: 'County Vital Records Office',
                contact: 'Varies by county',
                estimatedTime: '1-2 weeks',
                tips: [
                    'Order at least 10 certified copies - institutions won\'t accept photocopies',
                    'Some states offer expedited processing for an additional fee',
                    'Online ordering available in most states via VitalChek'
                ]
            }
        },
        {
            id: '2',
            name: 'Letters Testamentary / Letters of Administration',
            category: 'legal',
            status: 'have',
            required: true,
            howToObtain: {
                method: 'Probate Court',
                estimatedTime: '2-8 weeks after filing',
                tips: [
                    'Must be issued within 180 days for Fidelity accounts',
                    'Order multiple certified copies (at least 5)',
                    'Some courts provide "short certificates" - get both types'
                ]
            }
        },
        {
            id: '3',
            name: 'Fidelity Account Statement',
            category: 'financial',
            status: 'have',
            required: true,
            institution: 'Fidelity',
            howToObtain: {
                method: 'Already identified from your scan',
                tips: ['We found this in your uploaded documents']
            }
        },
        {
            id: '4',
            name: 'Medallion Signature Guarantee',
            category: 'financial',
            status: 'missing',
            required: true,
            institution: 'Fidelity',
            howToObtain: {
                method: 'Bank or Credit Union (must be a member)',
                estimatedTime: 'Same day (by appointment)',
                tips: [
                    'NOT a notary - this is a special bank service',
                    'Required for transfers over $100,000',
                    'Bring: Death certificate, Letters Testamentary, government ID',
                    'Call ahead - not all branches offer this service',
                    'Some banks charge $50-100 for non-members'
                ]
            }
        },
        {
            id: '5',
            name: 'IRS Form 56 (Notice Concerning Fiduciary Relationship)',
            category: 'tax',
            status: 'missing',
            required: true,
            howToObtain: {
                method: 'IRS Website',
                url: 'https://www.irs.gov/forms-pubs/about-form-56',
                estimatedTime: 'Immediate download',
                tips: [
                    'File this ASAP to receive tax documents in your name',
                    'Mail to the IRS address for your state',
                    'Keep a copy for your records'
                ]
            }
        },
        {
            id: '6',
            name: 'NJ Inheritance Tax Waiver (Form L-8)',
            category: 'tax',
            status: 'pending',
            required: true,
            howToObtain: {
                method: 'NJ Division of Taxation',
                estimatedTime: '4-12 weeks',
                tips: [
                    'Required before financial institutions will release funds in NJ',
                    'Can apply online via NJ Treasury portal',
                    'Fidelity will NOT process transfers without this'
                ]
            }
        }
    ];

    const getStatusIcon = (status: Document['status']) => {
        switch (status) {
            case 'have':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'missing':
                return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'pending':
                return <HelpCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    const getStatusColor = (status: Document['status']) => {
        switch (status) {
            case 'have':
                return 'var(--accent-sage-soft)';
            case 'missing':
                return 'var(--accent-orange-soft)';
            case 'pending':
                return 'var(--accent-blue-soft)';
        }
    };

    const categorizedDocs = {
        legal: documents.filter(d => d.category === 'legal'),
        financial: documents.filter(d => d.category === 'financial'),
        tax: documents.filter(d => d.category === 'tax')
    };

    const stats = {
        total: documents.length,
        have: documents.filter(d => d.status === 'have').length,
        missing: documents.filter(d => d.status === 'missing').length,
        pending: documents.filter(d => d.status === 'pending').length
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fdfcf8 0%, #e0f2fe 100%)',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-blue)',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Document Checklist</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Track your progress and learn how to obtain missing documents
                    </p>
                </motion.div>

                {/* Progress Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                            {stats.have}/{stats.total}
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>Documents Ready</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                            {stats.missing}
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>Still Needed</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-blue)' }}>
                            {stats.pending}
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>In Progress</div>
                    </div>
                </div>

                {/* Document Categories */}
                {Object.entries(categorizedDocs).map(([category, docs]) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h2 style={{
                            fontSize: '1.5rem',
                            marginBottom: '1rem',
                            textTransform: 'capitalize',
                            color: 'var(--text-primary)'
                        }}>
                            {category} Documents
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {docs.map(doc => (
                                <div
                                    key={doc.id}
                                    className="glass-card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        borderLeft: `4px solid ${getStatusColor(doc.status)}`,
                                        transition: 'transform 0.2s',
                                    }}
                                    onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                            <div style={{
                                                background: getStatusColor(doc.status),
                                                padding: '0.75rem',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {getStatusIcon(doc.status)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{doc.name}</h3>
                                                    {doc.required && (
                                                        <span style={{
                                                            background: 'var(--accent-orange)',
                                                            color: 'white',
                                                            padding: '0.125rem 0.5rem',
                                                            borderRadius: '12px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            REQUIRED
                                                        </span>
                                                    )}
                                                </div>
                                                {doc.institution && (
                                                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        For: {doc.institution}
                                                    </p>
                                                )}
                                                <p style={{
                                                    margin: '0.5rem 0 0 0',
                                                    fontSize: '0.85rem',
                                                    color: doc.status === 'have' ? 'var(--text-success)' : 'var(--text-muted)'
                                                }}>
                                                    {doc.status === 'have' && '✓ You have this document'}
                                                    {doc.status === 'missing' && '⚠ Click to see how to obtain'}
                                                    {doc.status === 'pending' && '⏳ Waiting for this document'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable "How to Obtain" Section */}
                                    {selectedDoc?.id === doc.id && doc.howToObtain && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{
                                                marginTop: '1.5rem',
                                                paddingTop: '1.5rem',
                                                borderTop: '1px solid var(--border-color)'
                                            }}
                                        >
                                            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-blue)' }}>
                                                How to Obtain This Document
                                            </h4>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Mail className="w-4 h-4 text-blue-500" />
                                                    <strong>Method:</strong> {doc.howToObtain.method}
                                                </div>

                                                {doc.howToObtain.contact && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Phone className="w-4 h-4 text-blue-500" />
                                                        <strong>Contact:</strong> {doc.howToObtain.contact}
                                                    </div>
                                                )}

                                                {doc.howToObtain.estimatedTime && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <HelpCircle className="w-4 h-4 text-blue-500" />
                                                        <strong>Timeline:</strong> {doc.howToObtain.estimatedTime}
                                                    </div>
                                                )}

                                                {doc.howToObtain.url && (
                                                    <a
                                                        href={doc.howToObtain.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            color: 'var(--accent-blue)',
                                                            textDecoration: 'none',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Download Form
                                                    </a>
                                                )}

                                                {doc.howToObtain.tips && doc.howToObtain.tips.length > 0 && (
                                                    <div style={{
                                                        background: 'var(--accent-blue-soft)',
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        marginTop: '0.5rem'
                                                    }}>
                                                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>💡 Important Tips:</strong>
                                                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                                            {doc.howToObtain.tips.map((tip, i) => (
                                                                <li key={i} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>{tip}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Documents;
