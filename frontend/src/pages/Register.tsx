import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, FileText, CheckCircle, Lock, MapPin } from 'lucide-react';
import { useState } from 'react';

const US_STATES = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = searchParams.get('role') || 'executor';
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            state: formData.get('state') as string,
            role: role.toUpperCase()
        };

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Registration failed');
            }

            // Store token and user data
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fdfcf8 0%, #f0fdf4 100%)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{ maxWidth: '500px', width: '100%' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Create Your Account</h2>
                    <p>You are joining as a <strong>{role === 'executor' ? 'Professional Executor' : 'Beneficiary'}</strong></p>
                </div>

                {error && (
                    <div style={{
                        background: 'var(--accent-orange-soft)',
                        border: '1px solid var(--accent-orange)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        color: 'var(--accent-orange)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                minLength={8}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                            Minimum 8 characters
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                            Your State <span style={{ color: 'var(--accent-orange)' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-muted)', zIndex: 1 }} />
                            <select
                                name="state"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    fontSize: '1rem',
                                    appearance: 'none'
                                }}
                            >
                                <option value="">Select your state</option>
                                {US_STATES.map(state => (
                                    <option key={state.code} value={state.code}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                            Required for state-specific legal requirements
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create My Advocate'} <CheckCircle className="w-5 h-5" />
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Already have an account?
                    </p>
                    <Link
                        to="/login"
                        style={{
                            color: 'var(--accent-blue)',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign In →
                    </Link>
                </div>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    By continuing, you agree to our terms of service and professional fiduciary standards.
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
