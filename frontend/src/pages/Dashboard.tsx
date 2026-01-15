import { motion } from 'framer-motion';
import { Heart, AlertCircle, Clock, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Asset {
    id: string;
    institution: string;
    type: string;
    value: { s: number; e: number; d: number[] };
    status: string;
    metadata: string;
    requirements: string;
}

interface Estate {
    name: string;
    status: string;
    assets: Asset[];
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [estate, setEstate] = useState<Estate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/estates/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setEstate(data.estate);
                }
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getUrgency = (metadata: string) => {
        try {
            const meta = JSON.parse(metadata);
            return meta.urgency || 'low';
        } catch { return 'low'; }
    };

    const getStatusInfo = (status: string) => {
        const statusMap: Record<string, { label: string; color: string; icon: any }> = {
            'CONTACTED': { label: 'In Progress', color: 'var(--color-accent)', icon: Clock },
            'DISTRIBUTED': { label: 'Complete', color: 'var(--color-success)', icon: CheckCircle2 },
            'Processing': { label: 'Processing', color: 'var(--color-warning)', icon: Clock },
        };
        return statusMap[status] || { label: status, color: 'var(--color-text-muted)', icon: Clock };
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    const urgentAssets = estate?.assets.filter(a => getUrgency(a.metadata) === 'high') || [];
    const inProgressAssets = estate?.assets.filter(a => a.status === 'CONTACTED') || [];
    const completedAssets = estate?.assets.filter(a => a.status === 'DISTRIBUTED') || [];

    return (
        <div style={{
            minHeight: '100vh',
            padding: 'var(--space-xl)',
            background: 'var(--color-bg-secondary)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Compassionate Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-header"
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <Heart style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-accent)' }} />
                        <h1 className="section-title" style={{ marginBottom: 0 }}>
                            {estate?.name || 'Your Estate'}
                        </h1>
                    </div>
                    <p className="section-subtitle">
                        We're here to help you through this process, one step at a time.
                    </p>
                </motion.div>

                {/* Urgent Actions Alert - Only show if there are urgent items */}
                {urgentAssets.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="alert alert-warning mb-5"
                    >
                        <AlertCircle className="alert-icon" />
                        <div className="alert-content">
                            <div className="alert-title">Action Needed</div>
                            <p style={{ marginBottom: 0 }}>
                                {urgentAssets.length} {urgentAssets.length === 1 ? 'asset needs' : 'assets need'} your attention. 
                                These institutions haven't responded in over 14 days.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Progress Overview - Compact, at-a-glance */}
                <div className="grid grid-cols-3 mb-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card card-compact text-center"
                    >
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>
                            {estate?.assets.length || 0}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            Total Assets
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card card-compact text-center"
                    >
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-warning)', marginBottom: 'var(--space-xs)' }}>
                            {inProgressAssets.length}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            In Progress
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card card-compact text-center"
                    >
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-success)', marginBottom: 'var(--space-xs)' }}>
                            {completedAssets.length}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            Completed
                        </div>
                    </motion.div>
                </div>

                {/* Assets List - Clean, scannable */}
                <div className="section-header">
                    <h2 className="section-title" style={{ fontSize: 'var(--font-size-xl)' }}>Your Assets</h2>
                    <p className="section-subtitle">
                        Click on any asset to see details and communication history
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {estate?.assets.map((asset, index) => {
                        const urgency = getUrgency(asset.metadata);
                        const statusInfo = getStatusInfo(asset.status);
                        const StatusIcon = statusInfo.icon;
                        const meta = JSON.parse(asset.metadata || '{}');
                        const reqs = JSON.parse(asset.requirements || '{}');

                        return (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    borderLeft: urgency === 'high' ? '4px solid var(--color-warning)' : 'none'
                                }}
                                onClick={() => navigate(`/assets/${asset.id}`)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {/* Left: Institution Info */}
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                            {asset.institution}
                                        </h3>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
                                            {asset.type}
                                        </p>
                                        
                                        {/* Status and Last Contact */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                                <StatusIcon style={{ width: '1rem', height: '1rem', color: statusInfo.color }} />
                                                <span style={{ fontSize: 'var(--font-size-sm)', color: statusInfo.color, fontWeight: 500 }}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            {meta.lastContact && (
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                    Last contact: {new Date(meta.lastContact).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Center: Value */}
                                    <div style={{ textAlign: 'right', marginRight: 'var(--space-xl)' }}>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                                            Value
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                            ${parseFloat(asset.value as any).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Right: Action */}
                                    <button 
                                        className="btn btn-ghost"
                                        style={{ padding: 'var(--space-sm)' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/assets/${asset.id}`);
                                        }}
                                    >
                                        <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                </div>

                                {/* Urgent Action Message */}
                                {urgency === 'high' && reqs.urgentAction && (
                                    <div style={{
                                        marginTop: 'var(--space-md)',
                                        padding: 'var(--space-md)',
                                        background: 'var(--color-warning-soft)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        <strong>Action needed:</strong> {reqs.urgentAction}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Helpful Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card mt-5"
                    style={{ background: 'var(--color-accent-soft)', borderColor: 'var(--color-accent-soft)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                Need to add documents?
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                                Upload death certificates, wills, or other estate documents
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/intake')}
                            className="btn btn-primary"
                        >
                            <FileText style={{ width: '1rem', height: '1rem' }} />
                            Upload Documents
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
