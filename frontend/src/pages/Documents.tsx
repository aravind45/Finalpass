import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Phone, Mail, Settings, FileText, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        <div className="p-8 max-w-7xl mx-auto space-y-8 bg-muted/20 min-h-screen">
            {loading && <div className="text-center py-10">Loading documents...</div>}

            <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="pl-0 hover:bg-transparent text-primary hover:text-primary/80">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Document Checklist</h1>
                        <p className="text-muted-foreground text-lg">
                            Tracking: <strong>{estateType.replace('_', ' ')}</strong>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex items-center gap-2 bg-card p-1 rounded-md border shadow-sm">
                            <Settings className="w-4 h-4 ml-2 text-muted-foreground" />
                            <Select value={estateType} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-[200px] border-0 focus:ring-0">
                                    <SelectValue placeholder="Estate Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(ESTATE_DOCUMENTS).map(type => (
                                        <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleGenerateDocument} className="w-full sm:w-auto">
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Will PDF
                        </Button>
                    </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-4xl text-emerald-600">{stats.have}/{stats.total}</CardTitle>
                            <CardDescription>Documents Ready</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-4xl text-orange-600">{stats.missing}</CardTitle>
                            <CardDescription>Still Needed</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-4xl text-blue-600">{stats.pending}</CardTitle>
                            <CardDescription>In Progress</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Document Categories */}
            {Object.entries(categorizedDocs).map(([category, docs]) => (
                docs.length > 0 && (
                    <div key={category} className="space-y-4">
                        <h2 className="text-2xl font-semibold capitalize">{category} Documents</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {docs.map(doc => (
                                <Card key={doc.id} className={`border-l-4 ${doc.status === 'have' ? 'border-l-emerald-500' :
                                    doc.status === 'missing' ? 'border-l-orange-500' :
                                        'border-l-blue-500'
                                    }`}>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 items-start flex-1">
                                                <div className={`p-3 rounded-xl ${doc.status === 'have' ? 'bg-emerald-100' :
                                                    doc.status === 'missing' ? 'bg-orange-100' :
                                                        'bg-blue-100'
                                                    }`}>
                                                    {getStatusIcon(doc.status)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-lg">{doc.name}</h3>
                                                        {doc.required && (
                                                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">REQUIRED</Badge>
                                                        )}
                                                    </div>
                                                    {doc.institution && (
                                                        <p className="text-sm text-muted-foreground mb-2">For: {doc.institution}</p>
                                                    )}
                                                    <p className={`text-sm ${doc.status === 'have' ? 'text-emerald-600 font-medium' : 'text-muted-foreground'
                                                        }`}>
                                                        {doc.status === 'have' && '✓ You have this document'}
                                                        {doc.status === 'missing' && '⚠ Action needed'}
                                                        {doc.status === 'pending' && '⏳ In progress'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {doc.howToObtain && doc.status !== 'have' && (
                                            <Accordion type="single" collapsible className="mt-4">
                                                <AccordionItem value="item-1" className="border-0">
                                                    <AccordionTrigger className="py-2 text-sm text-blue-600 hover:text-blue-700 hover:no-underline font-medium">
                                                        How to obtain this document?
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pt-2 pb-0">
                                                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail className="w-4 h-4 text-blue-500" />
                                                                <span className="font-medium">Method:</span>
                                                                <span>{doc.howToObtain.method}</span>
                                                            </div>

                                                            {doc.howToObtain.contact && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Phone className="w-4 h-4 text-blue-500" />
                                                                    <span className="font-medium">Contact:</span>
                                                                    <span>{doc.howToObtain.contact}</span>
                                                                </div>
                                                            )}

                                                            {doc.howToObtain.estimatedTime && (
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <HelpCircle className="w-4 h-4 text-blue-500" />
                                                                    <span className="font-medium">Timeline:</span>
                                                                    <span>{doc.howToObtain.estimatedTime}</span>
                                                                </div>
                                                            )}

                                                            {doc.howToObtain.url && (
                                                                <a
                                                                    href={doc.howToObtain.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mt-1"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Download Form
                                                                </a>
                                                            )}

                                                            {doc.howToObtain.tips && doc.howToObtain.tips.length > 0 && (
                                                                <div className="bg-blue-50/50 p-3 rounded-md mt-2">
                                                                    <strong className="block text-xs font-semibold text-blue-700 mb-1">💡 Tips</strong>
                                                                    <ul className="list-disc list-inside text-xs text-blue-900/80 space-y-1">
                                                                        {doc.howToObtain.tips.map((tip, i) => (
                                                                            <li key={i}>{tip}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default Documents;
