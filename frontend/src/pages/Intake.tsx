import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FileText, Check, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ChaoticIntake = () => {
    const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'executor';

    const foundDocs = [
        { type: 'Fidelity Brokerage', id: '..4829', status: 'verified' },
        { type: 'NJ Inheritance Tax Waiver', id: 'Form L-8', status: 'verified' },
        { type: 'Life Insurance Policy', id: 'MetLife', status: 'verified' },
    ];

    useEffect(() => {
        if (step === 'scanning') {
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep('results'), 1000);
                        return 100;
                    }
                    return p + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [step]);

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
            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card"
                        style={{ maxWidth: '600px', textAlign: 'center' }}
                    >
                        <div style={{ background: 'var(--accent-blue-soft)', padding: '2rem', borderRadius: '50%', width: 'fit-content', margin: '0 auto 2rem' }}>
                            <Camera className="w-12 h-12 text-blue-500" />
                        </div>
                        <h1 style={{ fontSize: '2.5rem' }}>Let's clear the clutter</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                            Take a deep breath. You don't need to organize these papers yourself. Just snap a photo or upload them, and our AI will do the heavy lifting for you.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setStep('scanning')}
                                className="btn-primary"
                                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Snap or Upload Papers <Sparkles className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'scanning' && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto 2rem' }}>
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-blue-soft)" strokeWidth="2" />
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="none" stroke="var(--accent-blue)" strokeWidth="4"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * progress) / 100}
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1.8rem' }}>AI is sorting your documents...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Identifying assets, tax forms, and legal requirements.</p>
                    </motion.div>
                )}

                {step === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card"
                        style={{ maxWidth: '600px', width: '100%' }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'inline-flex', background: 'var(--accent-sage-soft)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                                <Check className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 style={{ fontSize: '2rem' }}>Progress Found</h2>
                            <p>We've successfully identified 3 critical documents from your scan.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {foundDocs.map((doc, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: 'var(--accent-blue-soft)', padding: '0.75rem', borderRadius: '12px' }}>
                                            <FileText className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{role === 'executor' ? doc.type : 'Privacy Protected Asset'}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem' }}>{doc.id}</p>
                                        </div>
                                    </div>
                                    <Check className="text-emerald-500 w-5 h-5" />
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            Finish First Step <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChaoticIntake;
