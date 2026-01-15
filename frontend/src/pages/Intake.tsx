import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FileText, Check, Loader2, Sparkles, ArrowRight, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Intake = () => {
    const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStep('scanning');

        try {
            const formData = new FormData();
            formData.append('file', file);
            const docType = (window as any).selectedDocType || 'DEATH_CERTIFICATE';
            formData.append('type', docType);

            const token = localStorage.getItem('token');
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(prev => [...prev, data.document]);
                // Simulate "AI Scanning" delay
                setTimeout(() => {
                    setStep('results');
                }, 2000);
            } else {
                alert('Upload failed. Please try again.');
                setStep('upload');
            }
        } catch (error) {
            console.error(error);
            setStep('upload');
        } finally {
            setIsUploading(false);
        }
    };

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
                        <h1 style={{ fontSize: '2.5rem' }}>California Probate Scanning</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                            Upload your documents. Our AI detects California forms (DE-111, DE-160), Death Certificates, and Wills to auto-fill your case file.
                        </p>

                        <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                            <select
                                id="docType"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    marginTop: '0.5rem'
                                }}
                                defaultValue="DEATH_CERTIFICATE"
                                onChange={(e) => {
                                    // Store in a ref or state if needed, but for now we'll just read it in handleFileUpload
                                    (window as any).selectedDocType = e.target.value;
                                }}
                            >
                                <option value="DEATH_CERTIFICATE">Death Certificate</option>
                                <option value="WILL">Last Will & Testament</option>
                                <option value="TRUST">Living Trust</option>
                                <option value="LETTERS_TESTAMENTARY">Letters Testamentary</option>
                                <option value="LETTERS_ADMINISTRATION">Letters of Administration</option>
                                <option value="SMALL_ESTATE_AFFIDAVIT">Small Estate Affidavit</option>
                                <option value="ASSET_INVENTORY">Asset Inventory</option>
                                <option value="FINAL_ACCOUNTING">Final Accounting</option>
                                <option value="DE_111">Petition for Probate (DE-111)</option>
                                <option value="OTHER">Other Document</option>
                            </select>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                            accept="image/*,.pdf"
                        />

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary"
                                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="animate-spin" /> : <Upload className="w-5 h-5" />}
                                Upload Document
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
                                    strokeDashoffset="0"
                                    animate={{ strokeDashoffset: [283, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1.8rem' }}>AI is extracting data...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Identifying document type and key parties.</p>
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
                            <h2 style={{ fontSize: '2rem' }}>Success!</h2>
                            <p>We've processed your upload.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {uploadedFiles.map((doc, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
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
                                            <h4 style={{ margin: 0 }}>{doc.type}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {doc.fileName}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'var(--accent-sage-soft)',
                                        color: 'var(--accent-sage)',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        VERIFIED
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            Return to Dashboard <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Intake;
