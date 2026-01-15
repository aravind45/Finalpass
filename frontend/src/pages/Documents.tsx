import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Phone, Mail, Settings, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Document {
    id: string;
    name: string;
    category: 'legal' | 'financial' | 'tax' | 'admin';
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

const ESTATE_DOCUMENTS: Record<string, Document[]> = {
    SIMPLE_PROBATE: [
        {
            id: '1', name: 'Death Certificate', category: 'legal', status: 'have', required: true,
            howToObtain: { method: 'Vital Records Office', estimatedTime: '1-2 weeks', tips: ['Get 10+ certified copies'] }
        },
        {
            id: '2', name: 'Last Will & Testament', category: 'legal', status: 'have', required: true,
            howToObtain: { method: 'Executor/Attorney', tips: ['Must be original signed copy'] }
        },
        {
            id: '3', name: 'Letters Testamentary', category: 'legal', status: 'missing', required: true,
            howToObtain: { method: 'Probate Court', estimatedTime: '2-4 weeks', tips: ['Issued after filing petition'] }
        },
        {
            id: '4', name: 'Asset Inventory', category: 'financial', status: 'pending', required: true,
            howToObtain: { method: 'Compile from statements', tips: ['List all assets as of date of death'] }
        },
        {
            id: '5', name: 'Creditor Notices', category: 'admin', status: 'missing', required: true,
            howToObtain: { method: 'Newspaper Publication', tips: ['Publish in local paper', 'Mail to known creditors'] }
        },
        {
            id: '6', name: 'Final Accounting', category: 'financial', status: 'missing', required: true,
            howToObtain: { method: 'Executor/Accountant', tips: ['Prepare for court submission'] }
        }
    ],
    INTESTATE: [
        {
            id: '1', name: 'Death Certificate', category: 'legal', status: 'have', required: true,
            howToObtain: { method: 'Vital Records Office', estimatedTime: '1-2 weeks', tips: ['Get 10+ certified copies'] }
        },
        {
            id: '2', name: 'Petition for Administration', category: 'legal', status: 'missing', required: true,
            howToObtain: { method: 'Probate Court', tips: ['Check with attorney'] }
        },
        {
            id: '3', name: 'Letters of Administration', category: 'legal', status: 'missing', required: true,
            howToObtain: { method: 'Probate Court', estimatedTime: '2-4 weeks', tips: ['Issued after filing petition'] }
        },
        {
            id: '4', name: 'Heir Affidavit', category: 'legal', status: 'pending', required: true,
            howToObtain: { method: 'State Forms', tips: ['Notarization may be required'] }
        },
        {
            id: '5', name: 'Asset Inventory', category: 'financial', status: 'missing', required: true,
            howToObtain: { method: 'Compile from statements', tips: ['List all assets as of date of death'] }
        },
        {
            id: '6', name: 'Final Accounting', category: 'financial', status: 'missing', required: true,
            howToObtain: { method: 'Executor/Accountant', tips: ['Prepare for court submission'] }
        }
    ],
    TRUST_BASED: [
        {
            id: '1', name: 'Death Certificate', category: 'legal', status: 'have', required: true,
            howToObtain: { method: 'Vital Records Office', estimatedTime: '1-2 weeks', tips: ['Get 10+ certified copies'] }
        },
        {
            id: '2', name: 'Trust Agreement', category: 'legal', status: 'have', required: true,
            howToObtain: { method: 'Stored Location/Attorney', tips: ['Original signed trust doc'] }
        },
        {
            id: '3', name: 'Trustee Acceptance', category: 'legal', status: 'missing', required: true,
            howToObtain: { method: 'Attorney', tips: ['Trustee confirms role'] }
        },
        {
            id: '4', name: 'Asset Title Proof', category: 'financial', status: 'pending', required: true,
            howToObtain: { method: 'Banks/Brokerages', tips: ['Proof assets are in trust name'] }
        },
        {
            id: '5', name: 'Distribution Receipts', category: 'admin', status: 'missing', required: true,
            howToObtain: { method: 'Beneficiaries', tips: ['Signed acknowledgments'] }
        }
    ],
    SMALL_ESTATE: [
        {
            id: '1', name: 'Death Certificate', category: 'legal', status: 'have', required: true,
            howToObtain: { method: 'Vital Records Office', estimatedTime: '1-2 weeks', tips: ['Get 10+ certified copies'] }
        },
        {
            id: '2', name: 'Small Estate Affidavit', category: 'legal', status: 'missing', required: true,
            howToObtain: { method: 'State Forms', tips: ['Notarize', 'Wait 40 days (CA)'] }
        },
        {
            id: '3', name: 'Asset Statements', category: 'financial', status: 'have', required: true,
            howToObtain: { method: 'Banks', tips: ['Prove total value < $184,500 (CA)'] }
        },
        {
            id: '4', name: 'Heir Identity Proof', category: 'legal', status: 'pending', required: true,
            howToObtain: { method: 'Attorney/ID', tips: ['Proof of relationship'] }
        }
    ]
};

const Documents = () => {
    const navigate = useNavigate();
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [estateType, setEstateType] = useState<string>('SIMPLE_PROBATE');
    const [documents, setDocuments] = useState<Document[]>(ESTATE_DOCUMENTS['SIMPLE_PROBATE']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const type = data.data.user.estateType || 'SIMPLE_PROBATE';
                    setEstateType(type);
                    if (ESTATE_DOCUMENTS[type]) {
                        setDocuments(ESTATE_DOCUMENTS[type]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleTypeChange = (type: string) => {
        setEstateType(type);
        setDocuments(ESTATE_DOCUMENTS[type] || []);
    };

    const handleGenerateDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/documents/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ template: 'will' })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Last_Will_and_Testament.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error("Failed to generate document");
                alert("Failed to generate document. Please try again.");
            }
        } catch (error) {
            console.error("Error generating document", error);
            alert("Error generating document");
        }
    };

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
        tax: documents.filter(d => d.category === 'tax'),
        admin: documents.filter(d => d.category === 'admin')
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
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
                                Based on Estate Type: <strong>{estateType.replace('_', ' ')}</strong>
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={handleGenerateDocument}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'var(--accent-blue)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <FileText className="w-4 h-4" />
                                Generate Will PDF
                            </button>

                            {/* Dev Tool: Switch Estate Type */}
                            <div style={{
                                background: 'white',
                                padding: '1rem',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <Settings className="w-4 h-4" />
                                    <span>Dev: Switch Estate Type</span>
                                </div>
                                <select
                                    value={estateType}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {Object.keys(ESTATE_DOCUMENTS).map(type => (
                                        <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
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
                    docs.length > 0 && (
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
                    )
                ))}
            </div>
        </div>
    );
};

export default Documents;
