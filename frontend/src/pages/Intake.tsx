import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FileText, Check, Loader2, Sparkles, ArrowRight, Upload } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface UploadedFile {
    type: string;
    fileName: string;
}

const Intake = () => {
    const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [docType, setDocType] = useState('DEATH_CERTIFICATE');
    const navigate = useNavigate();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStep('scanning');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', docType);

            const token = localStorage.getItem('token');
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(prev => [...prev, data.document]);
                // Simulate "AI Scanning" delay
                setTimeout(() => {
                    setStep('results');
                }, 2000);
            } else {
                alert('Upload failed. Please try again.');
                setStep('upload');
            }
        } catch (error) {
            console.error(error);
            setStep('upload');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/20">
            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg"
                    >
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mx-auto bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                                    <Camera className="w-10 h-10 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl">California Probate Scanning</CardTitle>
                                <CardDescription className="text-base">
                                    Upload your documents. Our AI detects California forms (DE-111, DE-160), Death Certificates, and Wills to auto-fill your case file.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="docType">Document Type</Label>
                                    <Select value={docType} onValueChange={setDocType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DEATH_CERTIFICATE">Death Certificate</SelectItem>
                                            <SelectItem value="WILL">Last Will & Testament</SelectItem>
                                            <SelectItem value="TRUST">Living Trust</SelectItem>
                                            <SelectItem value="LETTERS_TESTAMENTARY">Letters Testamentary</SelectItem>
                                            <SelectItem value="LETTERS_ADMINISTRATION">Letters of Administration</SelectItem>
                                            <SelectItem value="SMALL_ESTATE_AFFIDAVIT">Small Estate Affidavit</SelectItem>
                                            <SelectItem value="ASSET_INVENTORY">Asset Inventory</SelectItem>
                                            <SelectItem value="FINAL_ACCOUNTING">Final Accounting</SelectItem>
                                            <SelectItem value="DE_111">Petition for Probate (DE-111)</SelectItem>
                                            <SelectItem value="OTHER">Other Document</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="file">Document</Label>
                                    <Input id="file" type="file" onChange={handleFileUpload} accept="image/*,.pdf" disabled={isUploading} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={isUploading}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {isUploading ? "Uploading..." : "Upload Document"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 'scanning' && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-8"
                    >
                        <div className="relative w-64 h-64 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                <motion.circle
                                    cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="4"
                                    strokeDasharray="283"
                                    strokeDashoffset="0"
                                    animate={{ strokeDashoffset: [283, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Sparkles className="w-16 h-16 text-blue-500 animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-foreground">AI is extracting data...</h2>
                            <p className="text-muted-foreground text-lg">Identifying document type and key parties.</p>
                        </div>
                    </motion.div>
                )}

                {step === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mx-auto bg-emerald-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                                    <Check className="w-10 h-10 text-emerald-600" />
                                </div>
                                <CardTitle className="text-2xl">Success!</CardTitle>
                                <CardDescription>We've processed your upload.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {uploadedFiles.map((doc, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{doc.type}</h4>
                                                <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                            VERIFIED
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => navigate('/dashboard')}>
                                    Return to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Intake;
