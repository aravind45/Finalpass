import React, { useState } from 'react';
import { X, Wand2, Copy, Check } from 'lucide-react';

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

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/communication/draft', {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-amber-900">
                        <Wand2 className="h-5 w-5 text-amber-600" />
                        <h2 className="text-lg font-serif font-semibold">AI Assistant: Magic Draft</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'input' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To specific recipient (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                    placeholder="e.g. Bank of America, Brother John"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">What is this regarding?</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                    placeholder="e.g. Notifying of death, Requesting account freeze"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                                    <select
                                        className="w-full rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        <option value="formal">Formal & Professional</option>
                                        <option value="sympathetic">Sympathetic & Gentle</option>
                                        <option value="stern">Stern & Direct</option>
                                        <option value="neutral">Neutral</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Key Details to Include</label>
                                <textarea
                                    className="w-full rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500 h-24"
                                    placeholder="e.g. Include account number ending in 1234. Mention death certificate is attached."
                                    value={keyDetails}
                                    onChange={(e) => setKeyDetails(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !purpose}
                                    className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Wand2 className="h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="h-4 w-4" />
                                            Generate Draft
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap border border-gray-200 shadow-inner max-h-[400px] overflow-y-auto">
                                {generatedDraft}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <button
                                    onClick={() => setStep('input')}
                                    className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    &larr; Refine Inputs
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium shadow-sm"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
