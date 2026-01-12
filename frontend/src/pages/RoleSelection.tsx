import { motion } from 'framer-motion';
import { Shield, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'executor',
            title: 'Executor / Personal Rep',
            description: 'I am handling the estate settlement and need the "Active Advocate" engine to manage institutions.',
            icon: <Shield className="w-12 h-12 text-blue-500" />,
            color: 'var(--accent-blue-soft)',
            borderColor: 'var(--accent-blue)',
        },
        {
            id: 'beneficiary',
            title: 'Beneficiary / Family Member',
            description: 'I want to track progress and find peace of mind through transparency and updates.',
            icon: <Heart className="w-12 h-12 text-emerald-500" />,
            color: 'var(--accent-sage-soft)',
            borderColor: 'var(--accent-sage)',
        },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fdfcf8 0%, #e0f2fe 100%)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)' }}>Welcome to FinalPass</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    We are here to provide a clear path forward. To begin, please tell us how you are involved.
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                maxWidth: '900px',
                width: '100%'
            }}>
                {roles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
                        className="glass-card"
                        onClick={() => navigate(`/register?role=${role.id}`)}
                        style={{
                            cursor: 'pointer',
                            border: `1px solid ${role.borderColor}33`,
                            background: `rgba(255, 255, 255, 0.8)`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{
                            background: role.color,
                            padding: '1.5rem',
                            borderRadius: '20px',
                            marginBottom: '1.5rem'
                        }}>
                            {role.icon}
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{role.title}</h2>
                        <p style={{ fontSize: '1rem', flexGrow: 1 }}>{role.description}</p>
                        <motion.div
                            whileHover={{ x: 5 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: role.borderColor,
                                fontWeight: '600',
                                marginTop: '1rem'
                            }}
                        >
                            Get Started <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}
            >
                Your privacy and trust are our highest priorities.
            </motion.p>
        </div>
    );
};

export default RoleSelection;
