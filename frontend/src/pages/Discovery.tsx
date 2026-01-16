

import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, CheckCircle, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface DiscoveredAsset {
    institution: string;
    type: string;
    value: string;
    confidence: number;
}

interface CardBodyContentProps {
    text: string;
    setText: (text: string) => void;
    analyzing: boolean;
    handleAnalyze: () => void;
    handleSimulation: () => void;
}

const Discovery = () => {
    const [step, setStep] = useState(1);
    const [analyzing, setAnalyzing] = useState(false);
    const [text, setText] = useState('');
    const [results, setResults] = useState<DiscoveredAsset[]>([]);

    const handleAnalyze = async () => {
        if (!text) return;
        setAnalyzing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/discovery/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text, fileName: 'Manual Paste' })
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.assets);
                setStep(2);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSimulation = async () => {
        setAnalyzing(true);
        // Simulate a delay for "AI Processing"
        await new Promise(r => setTimeout(r, 2000));

        // Mock data to show the user the power of the tool
        setResults([
            { institution: 'Vanguard Group', type: 'Investment Account', value: '125000.00', confidence: 0.95 },
            { institution: 'Chase Bank', type: 'Checking', value: '4500.00', confidence: 0.88 },
            { institution: 'Coinbase', type: 'Crypto Wallet', value: 'Unknown', confidence: 0.75 },
        ]);
        setAnalyzing(false);
        setStep(2);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Asset Detective
                    <Badge variant="secondary" className="ml-3 align-middle text-sm px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-100">BETA</Badge>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Upload tax returns or financial documents. Our AI scans them for hidden assets, dormant accounts, and insurance policies.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Card>
                            <CardBodyContent
                                text={text}
                                setText={setText}
                                analyzing={analyzing}
                                handleAnalyze={handleAnalyze}
                                handleSimulation={handleSimulation}
                            />
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-semibold">Found {results.length} Potential Assets</h3>
                                <Button variant="ghost" onClick={() => setStep(1)}>
                                    Scan Another Document
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {results.map((asset, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardContent className="flex items-center justify-between p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-blue-50 rounded-full">
                                                        {asset.confidence > 0.9 ?
                                                            <CheckCircle className="w-5 h-5 text-blue-600" /> :
                                                            <Search className="w-5 h-5 text-blue-400" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{asset.institution}</h4>
                                                        <p className="text-muted-foreground">
                                                            {asset.type} {asset.value !== 'Unknown' && `• Est. $${asset.value}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Asset
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CardBodyContent = ({ text, setText, analyzing, handleAnalyze, handleSimulation }: CardBodyContentProps) => {
    return (
        <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 bg-muted/5">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg">Paste Text or Upload Document</h3>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste extract from 1040 Tax Return, Bank Statement, or Email..."
                    className="min-h-[200px] resize-none text-base"
                />
            </div>

            <div className="flex justify-center gap-4">
                <Button
                    onClick={handleAnalyze}
                    disabled={!text && !analyzing}
                    className="w-40"
                >
                    {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {analyzing ? 'Scanning...' : 'Analyze Text'}
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleSimulation}
                >
                    Try Demo (Simulation)
                </Button>
            </div>
        </CardContent>
    )
}

export default Discovery;
