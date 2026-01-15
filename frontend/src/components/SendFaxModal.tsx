import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface SendFaxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const SendFaxModal = ({ isOpen, onClose, onSuccess }: SendFaxModalProps) => {
    const [recipient, setRecipient] = useState('');
    const [coverPage, setCoverPage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setError(null);

        try {
            await axios.post('/api/communication/fax', {
                recipient,
                coverPage,
                estateId: 'current-estate-id' // Ideally passed from context or props
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to send fax', err);
            setError('Failed to send fax. Please check the number and try again.');
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-xl font-semibold text-slate-900">Send Fax</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSend} className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Recipient Fax Number
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="+1 (555) 123-4567"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                            />
                            <p className="mt-1 text-xs text-slate-500">Include country code (e.g., +1 for US)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Cover Page / Message
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Enter the content of your fax..."
                                value={coverPage}
                                onChange={(e) => setCoverPage(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="pt-2 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSending}
                                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Fax
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
