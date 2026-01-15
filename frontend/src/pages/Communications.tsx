import { motion } from 'framer-motion';
import { Phone, Mail, Clock, CheckCircle2, FileText, Wand2, Printer } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiDraftModal } from '../components/AiDraftModal';
import { SendFaxModal } from '../components/SendFaxModal';

interface Log {
    id: string;
    type: string;
    party: string;
    subject: string;
    date: string;
    status: string;
}

const Communications = () => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isFaxModalOpen, setIsFaxModalOpen] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('/api/communication');
            setLogs(res.data);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'email': return <Mail />;
            case 'phone': return <Phone />;
            case 'fax': return <Printer />; // Changed to Printer for Fax
            default: return <FileText />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'email': return { bg: '#eff6ff', text: '#2563eb' };
            case 'phone': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'fax': return { bg: '#fefce8', text: '#ca8a04' }; // Amber/Yellow for Fax
            default: return { bg: '#fef2f2', text: '#ef4444' };
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>Communication Log</h1>
                        <p style={{ color: '#64748b' }}>Automatic tracking of every interaction for legal defense.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsFaxModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors font-medium shadow-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Send Fax
                        </button>
                        <button
                            onClick={() => setIsAiModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                        >
                            <Wand2 className="w-4 h-4" />
                            Magic Draft
                        </button>
                    </div>
                </div>
            </div>

            <AiDraftModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
            <SendFaxModal
                isOpen={isFaxModalOpen}
                onClose={() => setIsFaxModalOpen(false)}
                onSuccess={() => {
                    fetchLogs(); // Refresh logs after sending
                }}
            />

            <div style={{ display: 'grid', gap: '1rem' }}>
                {loading ? (
                    <div className="text-center py-10 text-slate-500">Loading communications...</div>
                ) : logs.map((log, i) => {
                    const colors = getColors(log.type);
                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card"
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                        >
                            <div style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                background: colors.bg,
                                color: colors.text
                            }}>
                                {getIcon(log.type)}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <h3 style={{ margin: 0, fontWeight: 600 }}>{log.party}</h3>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{log.date}</span>
                                </div>
                                <p style={{ margin: 0, color: '#475569' }}>{log.subject}</p>
                            </div>

                            <div style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '99px',
                                fontSize: '0.8rem',
                                background: log.status === 'pending' || log.status === 'queued' ? '#fffbeb' : '#f0fdf4',
                                color: log.status === 'pending' || log.status === 'queued' ? '#b45309' : '#16a34a',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                {log.status === 'pending' || log.status === 'queued' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {log.status}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};


export default Communications;
