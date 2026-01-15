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
    TrendingUp
} from 'lucide-react';
import CommunicationLog from '../components/CommunicationLog';

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

    useEffect(() => {
        if (assetId) {
            fetchAssetDetails();
            fetchNextActions();
        }
    }, [assetId]);

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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'var(--accent-orange)';
            case 'medium': return 'var(--accent-blue)';
            case 'low': return 'var(--accent-sage)';
            default: return '#64748b';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertCircle className="w-5 h-5" />;
            case 'medium': return <Clock className="w-5 h-5" />;
            case 'low': return <CheckCircle2 className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Asset Not Found</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const metadata = asset.metadata ? JSON.parse(asset.metadata) : {};
    const requirements = asset.requirements ? JSON.parse(asset.requirements) : {};

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fdfcf8 0%, #fff7ed 100%)'
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
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{asset.institution}</h1>
                            <p className="text-gray-600 text-lg">{asset.type}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Asset Value</div>
                            <div className="text-3xl font-bold text-blue-600">
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
                        className="mb-6"
                    >
                        <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: getPriorityColor(nextActions[0].priority) }}>
                            <div className="flex items-start gap-4">
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ background: `${getPriorityColor(nextActions[0].priority)}20` }}
                                >
                                    {getPriorityIcon(nextActions[0].priority)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">Action Required</h3>
                                    {nextActions.map((action, index) => (
                                        <div key={index} className="mb-3 last:mb-0">
                                            <p className="text-gray-800 mb-1">{action.message}</p>
                                            <p className="text-sm font-medium" style={{ color: getPriorityColor(action.priority) }}>
                                                Suggested: {action.suggestedAction}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Asset Details Grid */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold">Institution</h3>
                        </div>
                        <p className="text-gray-800">{asset.institution}</p>
                        <p className="text-sm text-gray-600 mt-1">{asset.type}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold">Status</h3>
                        </div>
                        <span
                            className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                            style={{
                                background: asset.status === 'DISTRIBUTED' ? 'var(--accent-sage-soft)' : 'var(--accent-orange-soft)',
                                color: asset.status === 'DISTRIBUTED' ? 'var(--accent-sage)' : 'var(--accent-orange)'
                            }}
                        >
                            {asset.status}
                        </span>
                        {metadata.lastContact && (
                            <p className="text-sm text-gray-600 mt-2">
                                Last contact: {new Date(metadata.lastContact).toLocaleDateString()}
                            </p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-semibold">Value</h3>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                            ${parseFloat(asset.value as any).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">As of date of death</p>
                    </motion.div>
                </div>

                {/* Communication Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <CommunicationLog assetId={asset.id} institution={asset.institution} />
                </motion.div>
            </div>
        </div>
    );
};

export default AssetDetail;
