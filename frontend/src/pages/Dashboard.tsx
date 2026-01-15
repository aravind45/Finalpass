import { motion } from 'framer-motion';
import { LayoutDashboard, AlertCircle, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Asset {
    id: string;
    institution: string;
    type: string;
    value: { s: number; e: number; d: number[] }; // Handling Prisma Decimal serialization
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

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            'CONTACTED': 'var(--accent-orange)',
            'DISTRIBUTED': 'var(--accent-sage)',
            'Processing': 'var(--accent-blue)',
        };
        const bgColors: Record<string, string> = {
            'CONTACTED': 'var(--accent-orange-soft)',
            'DISTRIBUTED': 'var(--accent-sage-soft)',
            'Processing': 'var(--accent-blue-soft)',
        };

        return (
            <span style={{
                background: bgColors[status] || '#f3f4f6',
                color: colors[status] || '#4b5563',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {status.replace(/_/g, ' ')}
            </span>
        );
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fdfcf8 0%, #fff7ed 100%)'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Estate Overview
                            </h2>
                            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {estate?.name || 'Your Estate'}
                            </h1>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Current Phase</p>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--accent-blue)',
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}>
                                <Sparkles className="w-5 h-5" />
                                {estate?.status || 'Asset Discovery'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    {/* Left Column: Asset List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Assets</h3>

                        {estate?.assets.map((asset, index) => {
                            const urgency = getUrgency(asset.metadata);
                            const meta = JSON.parse(asset.metadata || '{}');
                            const reqs = JSON.parse(asset.requirements || '{}');

                            const borderColors: Record<string, string> = {
                                'high': 'var(--accent-orange)',
                                'medium': 'var(--accent-blue)',
                                'low': 'var(--accent-sage)'
                            };

                            return (
                                <motion.div
                                    key={asset.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card"
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderLeft: `4px solid ${borderColors[urgency] || '#e5e7eb'}`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                                                {asset.institution}
                                            </h4>
                                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{asset.type}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                                ${parseFloat(asset.value as any).toLocaleString()}
                                            </span>
                                            <div>{getStatusBadge(asset.status)}</div>
                                        </div>
                                    </div>

                                    {/* Action/Status Line */}
                                    <div style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '0.75rem'
                                    }}>
                                        {urgency === 'high' ? (
                                            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                                        ) : urgency === 'medium' ? (
                                            <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        )}

                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, fontSize: '0.95rem' }}>
                                                {reqs.urgentAction || reqs.nextAction || 'Verification Complete'}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                Last Update: {meta.lastResponse || meta.completedDate}
                                            </p>
                                        </div>

                                        <button 
                                            className="btn-secondary" 
                                            style={{ padding: '0.25rem 0.5rem' }}
                                            onClick={() => navigate(`/assets/${asset.id}`)}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Right Column: Key Stats / Checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Overall Progress */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                        >
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LayoutDashboard className="w-5 h-5 text-blue-500" />
                                Settlement Progress
                            </h3>
                            <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                <div style={{ width: '35%', height: '100%', background: 'var(--accent-blue)' }}></div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                Estimated completion: <strong style={{ color: 'var(--text-primary)' }}>6 weeks</strong>
                            </p>
                        </motion.div>

                        {/* Quick Checklist */}
                        <div className="glass-card">
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Immediate Actions</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.6 }}>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Death Certificates</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: 0.6 }}>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Letters of Testament</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--accent-orange)' }}>
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Fidelity Escalation</span>
                                </li>
                            </ul>
                        </div>

                        {/* Intake CTA */}
                        <div className="glass-card" style={{ background: 'var(--accent-blue-soft)', border: '1px solid var(--accent-blue)' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Found more papers?</p>
                            <button
                                onClick={() => navigate('/intake')}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Scan New Documents
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
