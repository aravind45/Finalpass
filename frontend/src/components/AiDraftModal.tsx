import React, { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getApiUrl } from '@/lib/api';


interface AiDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: 'email' | 'letter';
}

export const AiDraftModal: React.FC<AiDraftModalProps> = ({ isOpen, onClose, initialType = 'email' }) => {
    const [step, setStep] = useState<'input' | 'result'>('input');
    const [isLoading, setIsLoading] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [purpose, setPurpose] = useState('');
    const [keyDetails, setKeyDetails] = useState('');
    const [tone, setTone] = useState('formal');
    const [generatedDraft, setGeneratedDraft] = useState('');
    const [copied, setCopied] = useState(false);

    // Reset state when modal opens/closes
    React.useEffect(() => {
        if (!isOpen) {
            // Optional: reset state when closed
            // setStep('input'); 
            // setGeneratedDraft('');
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(getApiUrl('/api/communication/draft'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: initialType,
                    recipient,
                    purpose,
                    tone,
                    keyDetails
                })
            });

            if (!response.ok) throw new Error('Failed to generate draft');

            const data = await response.json();
            setGeneratedDraft(data.draft);
            setStep('result');
        } catch (error) {
            console.error(error);
            // In a real app we might show a toast error here
            alert('Failed to generate draft. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedDraft);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
                <DialogHeader className="bg-amber-50/50 -mx-6 -mt-6 p-6 border-b border-amber-100/50 mb-0">
                    <DialogTitle className="flex items-center gap-2 text-amber-900">
                        <Wand2 className="h-5 w-5 text-amber-600" />
                        AI Assistant: Magic Draft
                    </DialogTitle>
                    <DialogDescription className="text-amber-800/80">
                        Explain what you need, and I'll draft a professional message for you.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 py-4 overflow-y-auto">
                    {step === 'input' ? (
                        <div className="space-y-4 px-1">
                            <div className="space-y-2">
                                <Label>To specific recipient (Optional)</Label>
                                <Input
                                    placeholder="e.g. Bank of America, Brother John"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>What is this regarding?</Label>
                                <Input
                                    placeholder="e.g. Notifying of death, Requesting account freeze"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tone</Label>
                                <Select value={tone} onValueChange={setTone}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formal">Formal & Professional</SelectItem>
                                        <SelectItem value="sympathetic">Sympathetic & Gentle</SelectItem>
                                        <SelectItem value="stern">Stern & Direct</SelectItem>
                                        <SelectItem value="neutral">Neutral</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Key Details to Include</Label>
                                <Textarea
                                    className="h-24 resize-none"
                                    placeholder="e.g. Include account number ending in 1234. Mention death certificate is attached."
                                    value={keyDetails}
                                    onChange={(e) => setKeyDetails(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 px-1 h-full flex flex-col">
                            <div className="bg-muted p-4 rounded-lg border shadow-inner flex-1 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                                {generatedDraft}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    {step === 'input' ? (
                        <>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading || !purpose}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate Draft
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setStep('input')} className="mr-auto">
                                &larr; Refine Inputs
                            </Button>
                            <Button
                                variant={copied ? "default" : "secondary"}
                                onClick={copyToClipboard}
                                className={copied ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </Button>
                            <Button onClick={onClose}>Done</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
