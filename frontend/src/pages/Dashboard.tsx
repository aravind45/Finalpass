import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fdfcf8 0%, #fff7ed 100%)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="glass-card"
                style={{ textAlign: 'center', maxWidth: '600px' }}
            >
                <LayoutDashboard className="w-16 h-12 text-orange-500 mb-4" style={{ margin: '0 auto' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Journey Begins</h1>
                <p style={{ fontSize: '1.1rem' }}>
                    Welcome to FinalPass. We are initializing your secure estate environment and connecting our Active Advocacy engine.
                </p>
                <div style={{
                    marginTop: '2rem',
                    padding: '2rem',
                    background: 'var(--accent-blue-soft)',
                    borderRadius: '24px',
                    border: '1px solid var(--accent-blue)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sparkles className="text-blue-500 w-6 h-6" />
                        <h3 style={{ margin: 0 }}>The Hardest Step is the First One</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        We know the paperwork is overwhelming. Let's start by clearing the "box of papers" together.
                    </p>
                    <button
                        onClick={() => navigate('/intake')}
                        className="btn-primary"
                        style={{ width: 'fit-content', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        Sort My Papers <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '2rem',
                    background: 'var(--accent-sage-soft)',
                    borderRadius: '24px',
                    border: '1px solid var(--accent-sage)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText className="text-emerald-500 w-6 h-6" />
                        <h3 style={{ margin: 0 }}>Document Checklist</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        Track what you have and learn how to get what you need.
                    </p>
                    <button
                        onClick={() => navigate('/documents')}
                        className="btn-primary"
                        style={{ width: 'fit-content', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-sage)' }}
                    >
                        View Documents <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center'
                }}>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Your legal interests are being guarded by the FinalPass Enforcer.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
