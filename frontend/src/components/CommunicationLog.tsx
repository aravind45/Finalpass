import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Phone,
    Mail,
    Send,
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock,
    Plus,
    Edit,
    Trash2,
    ArrowUp,
    ArrowDown
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
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchCommunications();
        fetchStats();
    }, [assetId]);

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

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'email': return <Mail className="w-4 h-4" />;
            case 'phone': return <Phone className="w-4 h-4" />;
            case 'fax': return <Send className="w-4 h-4" />;
            case 'mail': return <FileText className="w-4 h-4" />;
            case 'portal': return <MessageSquare className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'initial_contact': return 'var(--accent-blue)';
            case 'follow_up': return 'var(--accent-orange)';
            case 'escalation': return '#ef4444';
            case 'response': return 'var(--accent-sage)';
            default: return '#64748b';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="communication-log">
            {/* Stats Summary */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-600 mb-1">Total Communications</div>
                        <div className="text-2xl font-bold">{stats.totalCommunications}</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-600 mb-1">Response Rate</div>
                        <div className="text-2xl font-bold">{stats.responseRate.toFixed(0)}%</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-600 mb-1">Days Since First Contact</div>
                        <div className="text-2xl font-bold">{stats.daysSinceFirstContact}</div>
                    </div>
                    <div className="glass-card p-4">
                        <div className="text-sm text-gray-600 mb-1">Days Since Last Contact</div>
                        <div className="text-2xl font-bold text-orange-600">{stats.daysSinceLastContact}</div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Communication History</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Log Communication
                </button>
            </div>

            {/* Communications List */}
            {communications.length === 0 ? (
                <div className="glass-card p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">No communications logged yet</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary"
                    >
                        Log First Communication
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {communications.map((comm, index) => (
                        <motion.div
                            key={comm.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-4"
                            style={{
                                borderLeft: `4px solid ${getTypeColor(comm.type)}`
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ background: `${getTypeColor(comm.type)}20` }}
                                    >
                                        {getMethodIcon(comm.method)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold capitalize">
                                                {comm.type.replace('_', ' ')}
                                            </span>
                                            <span className="text-sm text-gray-500">via {comm.method}</span>
                                            {comm.direction === 'outbound' ? (
                                                <ArrowUp className="w-4 h-4 text-blue-500" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(comm.date)} • by {comm.createdBy.name}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {comm.subject && (
                                <div className="mb-2">
                                    <span className="font-medium">Subject: </span>
                                    <span>{comm.subject}</span>
                                </div>
                            )}

                            <div className="mb-3">
                                <div className="text-sm font-medium text-gray-700 mb-1">Content:</div>
                                <div className="text-gray-800 whitespace-pre-wrap">{comm.content}</div>
                            </div>

                            {comm.response && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">
                                            Response Received {comm.responseDate && `on ${formatDate(comm.responseDate)}`}
                                        </span>
                                    </div>
                                    <div className="text-gray-800 whitespace-pre-wrap">{comm.response}</div>
                                </div>
                            )}

                            {comm.nextActionDate && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">
                                            Next Action: {comm.nextActionType || 'Follow up'} by {formatDate(comm.nextActionDate)}
                                        </span>
                                    </div>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">Log Communication with {institution}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                required
                            >
                                <option value="initial_contact">Initial Contact</option>
                                <option value="follow_up">Follow Up</option>
                                <option value="escalation">Escalation</option>
                                <option value="response">Response</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Method</label>
                            <select
                                value={formData.method}
                                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                className="w-full p-2 border rounded-lg"
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

                    <div>
                        <label className="block text-sm font-medium mb-1">Direction</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="outbound"
                                    checked={formData.direction === 'outbound'}
                                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                                    className="mr-2"
                                />
                                Outbound (I contacted them)
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="inbound"
                                    checked={formData.direction === 'inbound'}
                                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                                    className="mr-2"
                                />
                                Inbound (They contacted me)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Subject (optional)</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            placeholder="e.g., Estate settlement inquiry"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Content *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            rows={4}
                            placeholder="What did you say or what was discussed?"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Response (if received)</label>
                        <textarea
                            value={formData.response}
                            onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                            placeholder="What did they say?"
                        />
                    </div>

                    {formData.response && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Response Date</label>
                            <input
                                type="datetime-local"
                                value={formData.responseDate}
                                onChange={(e) => setFormData({ ...formData, responseDate: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Next Action Date</label>
                            <input
                                type="date"
                                value={formData.nextActionDate}
                                onChange={(e) => setFormData({ ...formData, nextActionDate: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Next Action Type</label>
                            <input
                                type="text"
                                value={formData.nextActionType}
                                onChange={(e) => setFormData({ ...formData, nextActionType: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                placeholder="e.g., Follow up call"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary flex-1"
                        >
                            {submitting ? 'Logging...' : 'Log Communication'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
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
