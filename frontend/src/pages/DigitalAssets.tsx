
import { motion } from 'framer-motion';
import { Bitcoin, Cloud, Key, Shield, Plus, Lock } from 'lucide-react';
import { useState } from 'react';

const DigitalAssets = () => {
    // Mock data for MVP
    const [assets] = useState([
        { id: 1, type: 'crypto', name: 'Coinbase Exchange', value: 'Legacy Contact Active', icon: Bitcoin, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 2, type: 'cloud', name: 'Google Workspace', value: 'Primary Email', icon: Cloud, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 3, type: 'password', name: '1Password Master Key', value: 'Stored in Phyiscal Safe', icon: Key, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Digital Vault
                    </h1>
                    <p style={{ color: '#64748b' }}>Secure inventory for digital legacy, crypto, and passwords.</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus className="w-4 h-4" /> Add Digital Asset
                </button>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Lock className="w-6 h-6 text-red-500" />
                <div>
                    <h4 style={{ margin: 0, fontWeight: 600, color: '#991b1b' }}>Security Warning</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f1d1d' }}>
                        Never store actual passwords, seed phrases, or private keys here. Only store <strong>location hints</strong> (e.g., "In the blue safe") or legacy contact instructions.
                    </p>
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
                            <div style={{ padding: '0.75rem', borderRadius: '12px' }} className={asset.bg}>
                                <asset.icon className={`w-6 h-6 ${asset.color}`} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: 600 }}>{asset.name}</h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{asset.type.toUpperCase()}</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '99px',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                background: '#f1f5f9',
                                color: '#475569'
                            }}>
                                {asset.value}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DigitalAssets;
