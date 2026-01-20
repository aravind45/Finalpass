import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    MessageSquare,
    FileText,
    Send
} from 'lucide-react';
import CommunicationLog from '../components/CommunicationLog';
import SendFaxModal from '../components/SendFaxModal';
import AssetChecklist from '../components/AssetChecklist';

interface Asset {
    id: string;
    institution: string;
    type: string;
    value: number;
    status: string;
    requirements: string;
    metadata: string;
    createdAt: string;
    updatedAt: string;
}

interface NextAction {
    type: string;
    priority: 'high' | 'medium' | 'low';
    message: string;
    suggestedAction: string;
    dueDate: string;
}

interface FormMetadata {
    id: string;
    name: string;
    description: string;
    pageCount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const AssetDetail = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const navigate = useNavigate();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [nextActions, setNextActions] = useState<NextAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSendFax, setShowSendFax] = useState(false);
    const [forms, setForms] = useState<FormMetadata[]>([]);

    useEffect(() => {
        const fetchAssetDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/estates/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    const foundAsset = data.estate.assets.find((a: Asset) => a.id === assetId);
                    if (foundAsset) {
                        setAsset(foundAsset);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch asset:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchNextActions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/assets/${assetId}/next-actions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setNextActions(data.recommendations);
                }
            } catch (error) {
                console.error('Failed to fetch next actions:', error);
            }
        };

        if (assetId) {
            fetchAssetDetails();
            fetchNextActions();
        }
    }, [assetId]);

    useEffect(() => {
        const fetchForms = async () => {
            if (!asset) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/forms/institution/${encodeURIComponent(asset.institution)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setForms(data.forms);
                }
            } catch (error) {
                console.error('Failed to fetch forms:', error);
            }
        };

        if (asset) {
            fetchForms();
        }
    }, [asset]);

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertCircle style={{ width: '1.25rem', height: '1.25rem' }} />;
            case 'medium': return <Clock style={{ width: '1.25rem', height: '1.25rem' }} />;
            case 'low': return <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />;
            default: return <Clock style={{ width: '1.25rem', height: '1.25rem' }} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Asset Not Found</h2>
                    <p className="text-muted-foreground max-w-md">
                        We couldn't find this asset. It may have been removed or you may not have access to it.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const metadata = asset.metadata ? JSON.parse(asset.metadata) : {};
    const statusInfo = {
        'CONTACTED': { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-100' },
        'DISTRIBUTED': { label: 'Complete', color: 'text-emerald-600', bg: 'bg-emerald-100' },
        'Processing': { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-100' }
    }[asset.status] || { label: asset.status, color: 'text-slate-500', bg: 'bg-slate-100' };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {asset.institution}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {asset.type}
                            </p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="text-sm text-muted-foreground mb-1">
                                Asset Value
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                ${parseFloat(asset.value as any).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Next Actions Alert */}
                {nextActions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                    >
                        <div className="flex items-start gap-3">
                            {getPriorityIcon(nextActions[0].priority)}
                            <div className="flex-1 space-y-2">
                                <h3 className="font-semibold text-amber-900">Action Recommended</h3>
                                {nextActions.map((action, index) => (
                                    <div key={index} className="space-y-1">
                                        <p className="text-sm text-amber-800">{action.message}</p>
                                        <p className="text-sm font-semibold text-amber-900">
                                            Suggested: {action.suggestedAction}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card border border-border rounded-lg p-6 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <span className="text-sm font-semibold text-muted-foreground">
                                Institution
                            </span>
                        </div>
                        <div className="text-base font-semibold text-foreground">
                            {asset.institution}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {asset.type}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border border-border rounded-lg p-6 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <span className="text-sm font-semibold text-muted-foreground">
                                Status
                            </span>
                        </div>
                        <div className={`text-base font-semibold ${statusInfo.color}`}>
                            {statusInfo.label}
                        </div>
                        {metadata.lastContact && (
                            <div className="text-sm text-muted-foreground">
                                Last contact: {new Date(metadata.lastContact).toLocaleDateString()}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card border border-border rounded-lg p-6 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-semibold text-muted-foreground">
                                Value
                            </span>
                        </div>
                        <div className="text-xl font-bold text-emerald-600">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            ${parseFloat(asset.value as any).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            As of date of death
                        </div>
                    </motion.div>
                </div>

                {/* Forms Library */}
                {forms.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card border border-border rounded-lg p-6 space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-foreground">
                                    Forms & Documents
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Fill and fax forms directly to {asset.institution}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSendFax(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                <Send className="w-4 h-4" />
                                Send Fax
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {forms.map((form) => (
                                <div
                                    key={form.id}
                                    className="p-4 bg-muted/50 rounded-lg border border-border space-y-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 space-y-2">
                                            <div className="font-semibold text-foreground">
                                                {form.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {form.description}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {form.pageCount} pages • ${(form.pageCount * 0.07).toFixed(2)} to fax
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Settlement Checklist */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-card border border-border rounded-lg p-6"
                >
                    <AssetChecklist assetId={asset.id} />
                </motion.div>

                {/* Communication Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-lg p-6"
                >
                    <CommunicationLog assetId={asset.id} institution={asset.institution} />
                </motion.div>

                {/* Send Fax Modal */}
                {showSendFax && (
                    <SendFaxModal
                        assetId={asset.id}
                        institution={asset.institution}
                        onClose={() => setShowSendFax(false)}
                        onSuccess={() => {
                            setShowSendFax(false);
                            // Optionally refresh data
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default AssetDetail;
