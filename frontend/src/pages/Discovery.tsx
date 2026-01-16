
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, CheckCircle, Upload, ArrowRight, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [text, setText] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const handleAnalyze = async () => {
        if (!text) return;
        setAnalyzing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/discovery/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, fileName: 'Manual Paste' })
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.assets);
                setStep(2);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSimulation = async () => {
        setAnalyzing(true);
        // Simulate a delay for "AI Processing"
        await new Promise(r => setTimeout(r, 2000));

        // Mock data to show the user the power of the tool
        setResults([
            { institution: 'Vanguard Group', type: 'Investment Account', value: '125000.00', confidence: 0.95 },
            { institution: 'Chase Bank', type: 'Checking', value: '4500.00', confidence: 0.88 },
            { institution: 'Coinbase', type: 'Crypto Wallet', value: 'Unknown', confidence: 0.75 },
        ]);
        setAnalyzing(false);
        setStep(2);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                    Asset Detective <span style={{ fontSize: '1rem', background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '99px', verticalAlign: 'middle' }}>BETA</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Upload tax returns or financial documents. Our AI scans them for hidden assets, dormant accounts, and insurance policies.
                </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', minHeight: '400px' }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '3rem', textAlign: 'center', marginBottom: '2rem', background: '#f8fafc' }}>
                                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Paste Text or Upload Document</h3>

                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste extract from 1040 Tax Return, Bank Statement, or Email..."
                                    style={{
                                        width: '100%',
                                        height: '150px',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        marginBottom: '1rem'
                                    }}
                                />

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!text && !analyzing}
                                        className="btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                        {analyzing ? 'Scanning...' : 'Analyze Text'}
                                    </button>

                                    <button
                                        onClick={handleSimulation}
                                        className="btn-secondary"
                                        style={{ background: 'white', border: '1px solid #cbd5e1' }}
                                    >
                                        Try Demo (Simulation)
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Found {results.length} Potential Assets</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {results.map((asset, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        style={{
                                            padding: '1.5rem',
                                            background: 'white',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.75rem', background: '#dbeafe', borderRadius: '50%', color: '#2563eb' }}>
                                                {asset.confidence > 0.9 ? <CheckCircle className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{asset.institution}</h4>
                                                <p style={{ margin: 0, color: '#64748b' }}>{asset.type} {asset.value ? `• Est. $${asset.value}` : ''}</p>
                                            </div>
                                        </div>

                                        <button className="btn-secondary" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <button onClick={() => setStep(1)} style={{ color: '#64748b' }}>
                                ← Scan Another Document
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Discovery;
