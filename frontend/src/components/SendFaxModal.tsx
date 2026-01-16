import { useState, useEffect } from 'react';
import { Send, FileText, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
    const [coverPageNotes, setCoverPageNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [faxId, setFaxId] = useState<string | null>(null);
    const [estimatedCost, setEstimatedCost] = useState<number>(0);

    useEffect(() => {
        const loadForms = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };
        loadForms();
    }, [institution]);


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

    const handleFieldChange = (fieldId: string, value: string | number | boolean) => {
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
        } catch (error) {
            console.error('Failed to send fax:', error);
            setError(error instanceof Error ? error.message : 'Failed to send fax');
            setStep('review');
        }
    };


    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {step === 'select' && 'Select Form'}
                        {step === 'fill' && 'Fill Form'}
                        {step === 'review' && 'Review & Send'}
                        {step === 'sending' && 'Sending Fax...'}
                        {step === 'success' && 'Fax Sent!'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'select' && `Choose a form to fill and fax to ${institution}`}
                        {step === 'fill' && "We've pre-filled what we can. Please review and complete the remaining fields."}
                        {step === 'review' && `Review your information before sending. The fax will be sent to ${selectedForm?.faxInfo.recipientName}.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4 flex items-center gap-2 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Step: Select Form */}
                    {step === 'select' && (
                        <ScrollArea className="h-[400px]">
                            {forms.length === 0 ? (
                                <div className="text-center py-10 space-y-4">
                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                                    <h3 className="text-lg font-semibold">No forms available</h3>
                                    <p className="text-muted-foreground">
                                        We don't have forms for {institution} yet. Check back soon!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {forms.map(form => (
                                        <Card
                                            key={form.id}
                                            className="cursor-pointer hover:border-primary transition-colors"
                                            onClick={() => handleSelectForm(form)}
                                        >
                                            <CardContent className="p-4 flex items-start gap-4">
                                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg mb-1">{form.name}</h4>
                                                    <p className="text-muted-foreground text-sm mb-2">{form.description}</p>
                                                    <div className="text-xs text-muted-foreground bg-muted inline-block px-2 py-1 rounded">
                                                        {form.pageCount} pages • Fax to: {form.faxInfo.recipientFax}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    )}

                    {/* Step: Fill Form */}
                    {step === 'fill' && selectedForm && (
                        <div className="space-y-6">
                            {selectedForm.fields.map(field => (
                                <div key={field.id} className="space-y-2">
                                    <Label>
                                        {field.label}
                                        {field.required && <span className="text-destructive"> *</span>}
                                    </Label>

                                    {field.type === 'textarea' ? (
                                        <Textarea
                                            value={(formData[field.id] as string) || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            required={field.required}
                                        />
                                    ) : field.type === 'select' ? (
                                        <Select
                                            value={(formData[field.id] as string) || ''}
                                            onValueChange={(value) => handleFieldChange(field.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map(option => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : field.type === 'checkbox' ? (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={field.id}
                                                checked={(formData[field.id] as boolean) || false}
                                                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                                            />
                                            <label
                                                htmlFor={field.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Yes
                                            </label>
                                        </div>
                                    ) : (
                                        <Input
                                            type={field.type}
                                            value={(formData[field.id] as string) || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step: Review */}
                    {step === 'review' && selectedForm && (
                        <div className="space-y-6">
                            <div className="bg-muted p-4 rounded-lg space-y-4">
                                <h4 className="font-semibold text-sm text-primary">Form Data</h4>
                                {selectedForm.fields.map(field => (
                                    formData[field.id] && (
                                        <div key={field.id} className="grid grid-cols-3 gap-2 text-sm">
                                            <span className="text-muted-foreground">{field.label}</span>
                                            <span className="col-span-2 font-medium">
                                                {typeof formData[field.id] === 'boolean'
                                                    ? (formData[field.id] ? 'Yes' : 'No')
                                                    : formData[field.id]
                                                }
                                            </span>
                                        </div>
                                    )
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label>Cover Page Notes (optional)</Label>
                                <Textarea
                                    value={coverPageNotes}
                                    onChange={(e) => setCoverPageNotes(e.target.value)}
                                    placeholder="Add any additional notes for the cover page..."
                                />
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Estimated cost: ${((selectedForm.pageCount + 1) * 0.07).toFixed(2)} ({selectedForm.pageCount + 1} pages)
                            </div>
                        </div>
                    )}

                    {/* Step: Sending */}
                    {step === 'sending' && (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <Loader className="w-12 h-12 text-primary animate-spin" />
                            <div>
                                <h3 className="text-lg font-semibold">Sending your fax...</h3>
                                <p className="text-muted-foreground sm">
                                    This may take a moment. Please don't close this window.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step: Success */}
                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-green-700">Fax sent successfully!</h3>
                                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                                    Your fax has been sent to {selectedForm?.faxInfo.recipientName}. You'll receive a notification when it's delivered.
                                </p>
                            </div>
                            <div className="bg-muted px-4 py-2 rounded text-xs text-muted-foreground font-mono">
                                Cost: ${estimatedCost.toFixed(2)} • Fax ID: {faxId?.substring(0, 8)}...
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <DialogFooter className="mt-6 pt-2 border-t">
                    {step === 'fill' && (
                        <div className="flex gap-2 w-full justify-end">
                            <Button variant="outline" onClick={() => setStep('select')}>Back</Button>
                            <Button onClick={handleReview}>Review</Button>
                        </div>
                    )}
                    {step === 'review' && (
                        <div className="flex gap-2 w-full justify-end">
                            <Button variant="outline" onClick={() => setStep('fill')} disabled={loading}>Edit</Button>
                            <Button onClick={handleSendFax} className="gap-2" disabled={loading}>
                                {loading && <Loader className="w-4 h-4 animate-spin" />}
                                <Send className="w-4 h-4" />
                                Send Fax
                            </Button>
                        </div>
                    )}
                    {step === 'success' && (
                        <Button onClick={onClose} className="w-full">Done</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SendFaxModal;
