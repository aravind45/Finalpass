import { ArrowLeft, CheckCircle2, Clock, Phone, MessageSquare, Send, AlertTriangle, FileText, ChevronRight, ShieldAlert, BadgeCheck, PenTool, Printer } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssetClosure = () => {
    const navigate = useNavigate();

    // Workflow Data - Segregated into System (Concierge) vs User
    const actions = {
        concierge: [
            { id: 'c1', title: 'Identified Account Type', desc: 'Identified as Joint Tenant (JTWROS) based on statement analysis.', status: 'completed' },
            { id: 'c2', title: 'Generated Letter of Instruction', desc: 'Pre-filled with account # and beneficiary details.', status: 'completed' },
            { id: 'c3', title: 'Located Nearest Brand', desc: 'Fidelity Inv Ctr: 123 Main St (2.4 miles away).', status: 'completed' }
        ],
        user: [
            {
                id: 'u1',
                title: 'Review & Sign Packet',
                desc: 'We have prepared the transfer packet. Just review and sign.',
                type: 'action',
                primaryAction: 'Review PDF',
                time: '5 mins'
            },
            {
                id: 'u2',
                title: 'Drop in Mail / Visit Branch',
                desc: 'Since this is >$100k, a branch visit is fastest. We booked you a tentative slot.',
                type: 'action',
                primaryAction: 'View Appointment',
                time: '1 hour'
            }
        ]
    };

    const [logs, setLogs] = useState([
        { id: 1, type: 'system', msg: 'Concierge: Analyzed "Fidelity Statement_Oct.pdf". Detected JTWROS.', date: '2 days ago' },
        { id: 2, type: 'system', msg: 'Concierge: Pre-filled "Non-Retirement Transfer Form".', date: '1 day ago' }
    ]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/assets')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    border: 'none', background: 'none', color: '#64748b',
                    cursor: 'pointer', marginBottom: '1rem', fontWeight: 500
                }}
            >
                <ArrowLeft className="w-4 h-4" /> Back to Assets
            </button>

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Fidelity Asset Closure</h1>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>We handle the paperwork. You handle the signature.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* COLUMN 1: Concierge Prep (What We Did) */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <BadgeCheck className="w-6 h-6 text-blue-600" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: '#1e3a8a' }}>Concierge Prep</h2>
                    </div>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #bfdbfe', background: '#eff6ff' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #dbeafe' }}>
                            <p style={{ margin: 0, color: '#3b82f6', fontWeight: 500, fontSize: '0.9rem' }}>
                                ✅ We have completed 3 tasks for you
                            </p>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            {actions.concierge.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', opacity: 0.8 }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe',
                                        color: '#2563eb', display: 'grid', placeItems: 'center', flexShrink: 0
                                    }}>
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#1e40af' }}>{item.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FileText className="w-8 h-8 text-blue-400" />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#334155' }}>Letter_of_Instruction.pdf</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Generated 2 mins ago • Ready for Review</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: User Actions (What You Do) */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <PenTool className="w-6 h-6 text-orange-600" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, color: '#9a3412' }}>Your Action Items</h2>
                    </div>
                    {actions.user.map((item) => (
                        <div key={item.id} className="glass-card" style={{
                            padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #f97316',
                            boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.1)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</h3>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ea580c', background: '#fff7ed', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
                                    {item.time}
                                </span>
                            </div>
                            <p style={{ color: '#475569', lineHeight: '1.5', marginBottom: '1.5rem' }}>{item.desc}</p>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button style={{
                                    flex: 1, background: '#ea580c', color: 'white', border: 'none', padding: '0.75rem',
                                    borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    {item.primaryAction} <ChevronRight className="w-4 h-4" />
                                </button>
                                <button style={{
                                    padding: '0.75rem', background: 'white', border: '1px solid #e2e8f0',
                                    borderRadius: '8px', cursor: 'pointer', color: '#64748b'
                                }}>
                                    Skip
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Minimal Log */}
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Activity</h3>
                        {logs.map((log) => (
                            <div key={log.id} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                                <span>•</span>
                                <span>{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AssetClosure;
