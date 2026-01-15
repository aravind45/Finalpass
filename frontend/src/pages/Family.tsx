import { Copy, Mail, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const Family = () => {
    const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
    const [estateId, setEstateId] = useState<string | null>(null);
    const [updateContent, setUpdateContent] = useState(`Hi Everyone,

Here is the latest update on the estate settlement as of today:

✅ COMPLETED:
- Received Official Death Certificates
- Secure physical property and forwarded mail

⏳ IN PROGRESS:
- Waiting for legal review
- Identifying additional insurance policies

There is no action needed from you at this time. I will send another update next Friday.`);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchBeneficiaries = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/estates/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.estate) {
                    setEstateId(data.estate.id);
                    if (data.estate.stakeholders) {
                        // Filter specifically for extracted Beneficiaries
                        const bens = data.estate.stakeholders.filter((s: any) => s.type === 'BENEFICIARY');
                        setBeneficiaries(bens);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchBeneficiaries();
    }, []);

    const handleGenerateUpdate = async () => {
        if (!estateId) return;
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/ai/family/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estateId })
            });
            const data = await res.json();
            if (data.success) {
                setUpdateContent(data.draft);
            }
        } catch (err) {
            console.error('Failed to generate update:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>Family Updates</h1>
                <p style={{ color: '#64748b' }}>Generate transparent updates to keep beneficiaries informed.</p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail className="w-5 h-5 text-blue-500" />
                        Draft Update: Weekly Progress
                    </h3>
                    <button
                        onClick={handleGenerateUpdate}
                        disabled={isGenerating || !estateId}
                        className="btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'text-yellow-500'}`} />
                        {isGenerating ? 'Synthesizing...' : 'Generate with AI'}
                    </button>
                </div>

                <div style={{
                    background: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    color: '#334155'
                }}>
                    {updateContent}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={() => navigator.clipboard.writeText(updateContent)}
                    >
                        <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
                    </button>
                    <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.open(`mailto:?body=${encodeURIComponent(updateContent)}`)}>
                        <Mail className="w-4 h-4 mr-2" /> Open Email Client
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Beneficiaries (Extracted from Will)</h3>

                {beneficiaries.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
                        No beneficiaries found yet. Please upload the <strong>Last Will & Testament</strong> in the Intake section.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {beneficiaries.map((ben, i) => {
                            const info = JSON.parse(ben.info);
                            return (
                                <div key={i} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#2563eb', fontWeight: 'bold' }}>
                                        {info.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 500, display: 'block' }}>{info.name}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{info.relation} • {info.email}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Family;
