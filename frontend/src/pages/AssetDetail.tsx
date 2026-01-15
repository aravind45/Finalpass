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
    Plus,
    FileText,
    Send
} from 'lucide-react';
import CommunicationLog from '../components/CommunicationLog';
import SendFaxModal from '../components/SendFaxModal';

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

const AssetDetail = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const navigate = useNavigate();
    const [asset, setAsset] = useState<Asset | null>(null);
    const [nextActions, setNextActions] = useState<NextAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddComm, setShowAddComm] = useState(false);
    const [showSendFax, setShowSendFax] = useState(false);
    const [forms, setForms] = useState<any[]>([]);

    useEffect(() => {
        if (assetId) {
            fetchAssetDetails();
            fetchNextActions();
        }
    }, [assetId]);

    useEffect(() => {
        if (asset) {
            fetchForms();
        }
    }, [asset]);

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
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
                <div className="empty-state">
                    <div className="empty-state-title">Asset Not Found</div>
                    <p className="empty-state-description">
                        We couldn't find this asset. It may have been removed or you may not have access to it.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const metadata = asset.metadata ? JSON.parse(asset.metadata) : {};
    const statusInfo = {
        'CONTACTED': { label: 'In Progress', color: 'var(--color-accent)' },
        'DISTRIBUTED': { label: 'Complete', color: 'var(--color-success)' },
        'Processing': { label: 'Processing', color: 'var(--color-warning)' }
    }[asset.status] || { label: asset.status, color: 'var(--color-text-muted)' };

    return (
        <div style={{
            minHeight: '100vh',
            padding: 'var(--space-xl)',
            background: 'var(--color-bg-secondary)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: 'var(--space-xl)' }}
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-ghost mb-3"
                        style={{ padding: 'var(--space-xs) var(--space-sm)' }}
                    >
                        <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
                        Back to Dashboard
                    </button>

                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                        <div>
                            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                {asset.institution}
                            </h1>
                            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                                {asset.type}
                            </p>
                            <span className="badge badge-info">
                                {statusInfo.label}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                                Asset Value
                            </div>
                            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
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
                        className="alert alert-warning mb-5"
                    >
                        {getPriorityIcon(nextActions[0].priority)}
                        <div className="alert-content">
                            <div className="alert-title">Action Recommended</div>
                            {nextActions.map((action, index) => (
                                <div key={index} style={{ marginBottom: index < nextActions.length - 1 ? 'var(--space-sm)' : 0 }}>
                                    <p style={{ marginBottom: 'var(--space-xs)' }}>{action.message}</p>
                                    <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 0 }}>
                                        Suggested: {action.suggestedAction}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 mb-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card card-compact"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                            <Building2 style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent)' }} />
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                Institution
                            </span>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {asset.institution}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {asset.type}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card card-compact"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                            <MessageSquare style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent)' }} />
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                Status
                            </span>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: statusInfo.color }}>
                            {statusInfo.label}
                        </div>
                        {metadata.lastContact && (
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                Last contact: {new Date(metadata.lastContact).toLocaleDateString()}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card card-compact"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                            <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-success)' }} />
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                Value
                            </span>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-success)' }}>
                            ${parseFloat(asset.value as any).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
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
                        className="card mb-5"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <div>
                                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                    Forms & Documents
                                </h3>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                                    Fill and fax forms directly to {asset.institution}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSendFax(true)}
                                className="btn btn-primary"
                            >
                                <Send style={{ width: '1rem', height: '1rem' }} />
                                Send Fax
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                            {forms.map((form: any) => (
                                <div
                                    key={form.id}
                                    style={{
                                        padding: 'var(--space-lg)',
                                        background: 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--color-border-light)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                                        <FileText style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-accent)', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                                {form.name}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                                                {form.description}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                {form.pageCount} pages • ${(form.pageCount * 0.07).toFixed(2)} to fax
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Communication Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
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
