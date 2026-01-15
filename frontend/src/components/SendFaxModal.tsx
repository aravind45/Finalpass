import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, FileText, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

interface FormMetadata {
    id: string;
    name: string;
    institution: string;
    description: string;
    pageCount: number;
    fields: FormField[];
    faxInfo: {
        recipientName: string;
        recipientFax: string;
        coverPageRequired: boolean;
    };
}

interface FormField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'checkbox' | 'textarea';
    required: boolean;
    options?: string[];
}

interface SendFaxModalProps {
    assetId: string;
    institution: string;
    onClose: () => void;
    onSuccess: () => void;
}

const SendFaxModal = ({ assetId, institution, onClose, onSuccess }: SendFaxModalProps) => {
    const [step, setStep] = useState<'select' | 'fill' | 'review' | 'sending' | 'success'>('select');
    const [forms, setForms] = useState<FormMetadata[]>([]);
    const [selectedForm, setSelectedForm] = useState<FormMetadata | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [coverPageNotes, setCoverPageNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [faxId, setFaxId] = useState<string | null>(null);
    const [estimatedCost, setEstimatedCost] = useState<number>(0);

    useEffect(() => {
        loadForms();
    }, [institution]);

    const loadForms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/forms/institution/${encodeURIComponent(institution)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setForms(data.forms);
            }
        } catch (error) {
            console.error('Failed to load forms:', error);
            setError('Failed to load forms');
        }
    };

    const handleSelectForm = async (form: FormMetadata) => {
        setSelectedForm(form);
        setLoading(true);
        setError(null);

        try {
            // Auto-populate form data
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/forms/${form.id}/auto-populate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ assetId })
            });

            const data = await response.json();
            if (data.success) {
                setFormData(data.data);
            }
            setStep('fill');
        } catch (error) {
            console.error('Failed to auto-populate form:', error);
            setError('Failed to load form data');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleReview = () => {
        // Validate required fields
        const missingFields = selectedForm?.fields
            .filter(f => f.required && !formData[f.id])
            .map(f => f.label);

        if (missingFields && missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        setError(null);
        setStep('review');
    };

    const handleSendFax = async () => {
        if (!selectedForm) return;

        setStep('sending');
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/forms/${selectedForm.id}/fax`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    assetId,
                    data: formData,
                    coverPageNotes
                })
            });

            const data = await response.json();
            if (data.success) {
                setFaxId(data.faxId);
                setEstimatedCost(data.estimatedCost);
                setStep('success');
                setTimeout(() => {
                    onSuccess();
                }, 3000);
            } else {
                setError(data.error || 'Failed to send fax');
                setStep('review');
            }
        } catch (error: any) {
            console.error('Failed to send fax:', error);
            setError(error.message || 'Failed to send fax');
            setStep('review');
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
                    maxWidth: '700px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>
                        {step === 'select' && 'Select Form'}
                        {step === 'fill' && 'Fill Form'}
                        {step === 'review' && 'Review & Send'}
                        {step === 'sending' && 'Sending Fax...'}
                        {step === 'success' && 'Fax Sent!'}
                    </h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 'var(--space-xs)' }}>
                        <X style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        padding: 'var(--space-md)',
                        background: 'var(--color-warning-soft)',
                        borderLeft: '4px solid var(--color-warning)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-lg)',
                        display: 'flex',
                        gap: 'var(--space-sm)',
                        alignItems: 'start'
                    }}>
                        <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-warning)', flexShrink: 0 }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{error}</span>
                    </div>
                )}

                {/* Step: Select Form */}
                {step === 'select' && (
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Choose a form to fill and fax to {institution}
                        </p>

                        {forms.length === 0 ? (
                            <div className="empty-state">
                                <FileText className="empty-state-icon" />
                                <div className="empty-state-title">No forms available</div>
                                <p className="empty-state-description">
                                    We don't have forms for {institution} yet. Check back soon!
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                {forms.map(form => (
                                    <button
                                        key={form.id}
                                        onClick={() => handleSelectForm(form)}
                                        disabled={loading}
                                        style={{
                                            padding: 'var(--space-lg)',
                                            background: 'var(--color-bg-tertiary)',
                                            border: '2px solid var(--color-border-light)',
                                            borderRadius: 'var(--radius-lg)',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                                            e.currentTarget.style.background = 'var(--color-bg-secondary)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-border-light)';
                                            e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-md)' }}>
                                            <FileText style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-accent)', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text-primary)' }}>
                                                    {form.name}
                                                </div>
                                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                                                    {form.description}
                                                </div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                    {form.pageCount} pages • Fax to: {form.faxInfo.recipientFax}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step: Fill Form */}
                {step === 'fill' && selectedForm && (
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            We've pre-filled what we can. Please review and complete the remaining fields.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {selectedForm.fields.map(field => (
                                <div key={field.id} className="form-group">
                                    <label className="form-label">
                                        {field.label}
                                        {field.required && <span style={{ color: 'var(--color-warning)' }}> *</span>}
                                    </label>
                                    
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            className="form-textarea"
                                            rows={3}
                                            required={field.required}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            className="form-select"
                                            required={field.required}
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'checkbox' ? (
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData[field.id] || false}
                                                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                                            />
                                            <span style={{ fontSize: 'var(--font-size-sm)' }}>Yes</span>
                                        </label>
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={formData[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            className="form-input"
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
                            <button
                                onClick={() => setStep('select')}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleReview}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                Review
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Review */}
                {step === 'review' && selectedForm && (
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Review your information before sending. The fax will be sent to {selectedForm.faxInfo.recipientName}.
                        </p>

                        {/* Form Data Summary */}
                        <div style={{
                            padding: 'var(--space-lg)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--color-text-primary)' }}>
                                Form Data
                            </h4>
                            {selectedForm.fields.map(field => (
                                formData[field.id] && (
                                    <div key={field.id} style={{ marginBottom: 'var(--space-sm)' }}>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                            {field.label}
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                                            {typeof formData[field.id] === 'boolean' 
                                                ? (formData[field.id] ? 'Yes' : 'No')
                                                : formData[field.id]
                                            }
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Cover Page Notes */}
                        <div className="form-group">
                            <label className="form-label">Cover Page Notes (optional)</label>
                            <textarea
                                value={coverPageNotes}
                                onChange={(e) => setCoverPageNotes(e.target.value)}
                                className="form-textarea"
                                rows={3}
                                placeholder="Add any additional notes for the cover page..."
                            />
                        </div>

                        {/* Cost Estimate */}
                        <div style={{
                            padding: 'var(--space-md)',
                            background: 'var(--color-accent-soft)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--space-lg)'
                        }}>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                                Estimated cost: ${((selectedForm.pageCount + 1) * 0.07).toFixed(2)} ({selectedForm.pageCount + 1} pages)
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            <button
                                onClick={() => setStep('fill')}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleSendFax}
                                className="btn btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)' }}
                            >
                                <Send style={{ width: '1rem', height: '1rem' }} />
                                Send Fax
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Sending */}
                {step === 'sending' && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                        <Loader style={{ width: '3rem', height: '3rem', color: 'var(--color-accent)', margin: '0 auto var(--space-lg)', animation: 'spin 1s linear infinite' }} />
                        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-text-primary)' }}>
                            Sending your fax...
                        </div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            This may take a moment. Please don't close this window.
                        </p>
                    </div>
                )}

                {/* Step: Success */}
                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                        <CheckCircle2 style={{ width: '3rem', height: '3rem', color: 'var(--color-success)', margin: '0 auto var(--space-lg)' }} />
                        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-text-primary)' }}>
                            Fax sent successfully!
                        </div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Your fax has been sent to {selectedForm?.faxInfo.recipientName}. You'll receive a notification when it's delivered.
                        </p>
                        <div style={{
                            padding: 'var(--space-md)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Cost: ${estimatedCost.toFixed(2)} • Fax ID: {faxId?.substring(0, 8)}...
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default SendFaxModal;
