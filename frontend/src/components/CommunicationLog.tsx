import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Phone,
    Mail,
    Send,
    FileText,
    Plus,
    ArrowUp,
    ArrowDown,
    X,
    CheckCircle2
} from 'lucide-react';

interface Communication {
    id: string;
    date: string;
    type: 'initial_contact' | 'follow_up' | 'escalation' | 'response';
    method: 'email' | 'phone' | 'fax' | 'mail' | 'portal';
    direction: 'inbound' | 'outbound';
    subject?: string;
    content: string;
    response?: string;
    responseDate?: string;
    nextActionDate?: string;
    nextActionType?: string;
    createdBy: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

interface CommunicationLogProps {
    assetId: string;
    institution: string;
}

const CommunicationLog = ({ assetId, institution }: CommunicationLogProps) => {
    const [communications, setCommunications] = useState<Communication[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState<{ totalCommunications: number; daysSinceLastContact: number } | null>(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/assets/${assetId}/communications/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchCommunications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/assets/${assetId}/communications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setCommunications(data.communications);
            }
        } catch (error) {
            console.error('Failed to fetch communications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunications();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetId]);

    const getMethodIcon = (method: string) => {
        const iconProps = { style: { width: '1rem', height: '1rem' } };
        switch (method) {
            case 'email': return <Mail {...iconProps} />;
            case 'phone': return <Phone {...iconProps} />;
            case 'fax': return <Send {...iconProps} />;
            case 'mail': return <FileText {...iconProps} />;
            case 'portal': return <MessageSquare {...iconProps} />;
            default: return <MessageSquare {...iconProps} />;
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'initial_contact': 'Initial Contact',
            'follow_up': 'Follow Up',
            'escalation': 'Escalation',
            'response': 'Response Received'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <div>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                        Communication History
                    </h3>
                    {stats && (
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 0 }}>
                            {stats.totalCommunications} {stats.totalCommunications === 1 ? 'interaction' : 'interactions'} •
                            {stats.daysSinceLastContact === 0 ? ' Last contact today' : ` ${stats.daysSinceLastContact} days since last contact`}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                >
                    <Plus style={{ width: '1rem', height: '1rem' }} />
                    Log Communication
                </button>
            </div>

            {/* Communications List */}
            {communications.length === 0 ? (
                <div className="empty-state">
                    <MessageSquare className="empty-state-icon" />
                    <div className="empty-state-title">No communications yet</div>
                    <p className="empty-state-description">
                        Start by logging your first interaction with {institution}.
                        This helps track progress and ensures nothing falls through the cracks.
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary"
                    >
                        Log First Communication
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {communications.map((comm, index) => (
                        <motion.div
                            key={comm.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                padding: 'var(--space-lg)',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border-light)'
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                    <div style={{
                                        padding: 'var(--space-xs)',
                                        background: 'var(--color-bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {getMethodIcon(comm.method)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                            {getTypeLabel(comm.type)}
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                            {formatDate(comm.date)} • {comm.method}
                                            {comm.direction === 'outbound' ? (
                                                <ArrowUp style={{ width: '0.75rem', height: '0.75rem', display: 'inline', marginLeft: '0.25rem' }} />
                                            ) : (
                                                <ArrowDown style={{ width: '0.75rem', height: '0.75rem', display: 'inline', marginLeft: '0.25rem' }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subject */}
                            {comm.subject && (
                                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                    {comm.subject}
                                </div>
                            )}

                            {/* Content */}
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: comm.response ? 'var(--space-sm)' : 0, lineHeight: 'var(--line-height-relaxed)' }}>
                                {comm.content}
                            </div>

                            {/* Response */}
                            {comm.response && (
                                <div style={{
                                    marginTop: 'var(--space-sm)',
                                    padding: 'var(--space-md)',
                                    background: 'var(--color-success-soft)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: '3px solid var(--color-success)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
                                        <CheckCircle2 style={{ width: '1rem', height: '1rem', color: 'var(--color-success)' }} />
                                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-success)' }}>
                                            Response {comm.responseDate && `• ${formatDate(comm.responseDate)}`}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 'var(--line-height-relaxed)' }}>
                                        {comm.response}
                                    </div>
                                </div>
                            )}

                            {/* Next Action */}
                            {comm.nextActionDate && (
                                <div style={{
                                    marginTop: 'var(--space-sm)',
                                    padding: 'var(--space-sm)',
                                    background: 'var(--color-accent-soft)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--font-size-xs)',
                                    color: 'var(--color-text-primary)'
                                }}>
                                    <strong>Next:</strong> {comm.nextActionType || 'Follow up'} by {formatDate(comm.nextActionDate)}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Communication Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddCommunicationModal
                        assetId={assetId}
                        institution={institution}
                        onClose={() => setShowAddModal(false)}
                        onSuccess={() => {
                            setShowAddModal(false);
                            fetchCommunications();
                            fetchStats();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Add Communication Modal Component
interface AddCommunicationModalProps {
    assetId: string;
    institution: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddCommunicationModal = ({ assetId, institution, onClose, onSuccess }: AddCommunicationModalProps) => {
    const [formData, setFormData] = useState({
        type: 'follow_up',
        method: 'email',
        direction: 'outbound',
        subject: '',
        content: '',
        response: '',
        responseDate: '',
        nextActionDate: '',
        nextActionType: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/assets/${assetId}/communications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    responseDate: formData.responseDate || undefined,
                    nextActionDate: formData.nextActionDate || undefined
                })
            });

            const data = await response.json();
            if (data.success) {
                onSuccess();
            } else {
                alert('Failed to log communication: ' + data.error);
            }
        } catch (error) {
            console.error('Failed to log communication:', error);
            alert('Failed to log communication');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                padding: 'var(--space-xl)'
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                style={{
                    background: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-xl)',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                        Log Communication
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 'var(--space-xs)' }}>
                        <X style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                </div>

                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                    Recording your interactions with {institution} helps track progress and ensures timely follow-ups.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-md mb-4">
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="initial_contact">Initial Contact</option>
                                <option value="follow_up">Follow Up</option>
                                <option value="escalation">Escalation</option>
                                <option value="response">Response Received</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Method</label>
                            <select
                                value={formData.method}
                                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="fax">Fax</option>
                                <option value="mail">Mail</option>
                                <option value="portal">Online Portal</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Direction</label>
                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    value="outbound"
                                    checked={formData.direction === 'outbound'}
                                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                                />
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>I contacted them</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    value="inbound"
                                    checked={formData.direction === 'inbound'}
                                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                                />
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>They contacted me</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Subject (optional)</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="form-input"
                            placeholder="Brief description"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">What happened? *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="form-textarea"
                            rows={4}
                            placeholder="Describe what was discussed or what you sent..."
                            required
                        />
                    </div>

                    {formData.direction === 'inbound' && (
                        <div className="form-group">
                            <label className="form-label">Their Response</label>
                            <textarea
                                value={formData.response}
                                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                                className="form-textarea"
                                rows={3}
                                placeholder="What did they say?"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-md">
                        <div className="form-group">
                            <label className="form-label">Follow up by</label>
                            <input
                                type="date"
                                value={formData.nextActionDate}
                                onChange={(e) => setFormData({ ...formData, nextActionDate: e.target.value })}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Next action</label>
                            <input
                                type="text"
                                value={formData.nextActionType}
                                onChange={(e) => setFormData({ ...formData, nextActionType: e.target.value })}
                                className="form-input"
                                placeholder="e.g., Call for update"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                        >
                            {submitting ? 'Saving...' : 'Save Communication'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CommunicationLog;
