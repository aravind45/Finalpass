import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
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
            background: 'linear-gradient(135deg, #fdfcf8 0%, #e0f2fe 100%)',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        background: 'var(--accent-blue-soft)',
                        padding: '1rem',
                        borderRadius: '50%',
                        marginBottom: '1rem'
                    }}>
                        <LogIn className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Sign in to continue your estate settlement journey
                    </p>
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
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your.email@example.com"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            <Lock className="w-4 h-4 inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <Sparkles className="w-5 h-5" />}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Don't have an account?
                    </p>
                    <Link
                        to="/"
                        style={{
                            color: 'var(--accent-blue)',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Create Account →
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
