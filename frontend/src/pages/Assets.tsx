import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';
import { useEffect, useState } from 'react';

const Assets = () => {
    const [assets, setAssets] = useState<any[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/estates/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setAssets(data.estate.assets);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAssets();
    }, []);

    const totalValue = assets.reduce((acc, curr) => acc + parseFloat(curr.value || 0), 0);
    // CA Warning: Probate triggered if > $184,500
    const probateThreshold = 184500;
    const isProbateLikely = totalValue > probateThreshold;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>California Asset Inventory</h1>
                    <p style={{ color: '#64748b' }}>Statutory Threshold: ${probateThreshold.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Gross Estate Value</p>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: isProbateLikely ? '#ea580c' : '#16a34a' }}>
                        ${totalValue.toLocaleString()}
                    </h2>
                    {isProbateLikely && (
                        <span style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: 600 }}>⚠ Exceeds Small Estate Limit</span>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {assets.map((asset, i) => (
                    <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                        style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '12px' }}>
                                <Gem className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: 600 }}>{asset.institution}</h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{asset.type}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Designation</p>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '99px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    background: '#f1f5f9',
                                    color: '#475569'
                                }}>
                                    {asset.type.includes('IRA') || asset.type.includes('401k') ? 'Non-Probate (Beneficiary)' : 'Probate Asset'}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Value</p>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                    ${parseFloat(asset.value).toLocaleString()}
                                </span>
                            </div>

                            {/* Action Button for Fidelity/Closure Workflow */}
                            {asset.institution.includes('Fidelity') && (
                                <a
                                    href="/asset-closure"
                                    style={{
                                        textDecoration: 'none',
                                        background: '#2563eb',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        fontWeight: 500,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Start Closure
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Assets;
