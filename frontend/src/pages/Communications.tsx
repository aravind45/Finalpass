
import { motion } from 'framer-motion';
import { Phone, Mail, FileText, Wand2, Printer, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiDraftModal } from '../components/AiDraftModal';
import SendFaxModal from '../components/SendFaxModal';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
    const [searchTerm, setSearchTerm] = useState('');

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
            case 'email': return <Mail className="w-4 h-4" />;
            case 'phone': return <Phone className="w-4 h-4" />;
            case 'fax': return <Printer className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const filteredLogs = logs.filter(log =>
        log.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Communication Log</h1>
                    <p className="text-muted-foreground">Automatic tracking of every interaction for legal defense.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsFaxModalOpen(true)}>
                        <Printer className="w-4 h-4 mr-2" />
                        Send Fax
                    </Button>
                    <Button onClick={() => setIsAiModalOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Magic Draft
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Recent Activity</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search logs..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        <div className="flex flex-col">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">Loading communications...</div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No logs found.</div>
                            ) : filteredLogs.map((log, i) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                                        <div className={`p-2 rounded-full mr-4 ${log.type === 'email' ? 'bg-blue-100 text-blue-600' :
                                                log.type === 'phone' ? 'bg-green-100 text-green-600' :
                                                    'bg-amber-100 text-amber-600'
                                            }`}>
                                            {getIcon(log.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-semibold truncate">{log.party}</h4>
                                                <span className="text-xs text-muted-foreground">{log.date}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{log.subject}</p>
                                        </div>
                                        <div className="ml-4">
                                            <Badge variant={log.status === 'completed' || log.status === 'sent' ? 'outline' : 'secondary'} className={
                                                log.status === 'completed' || log.status === 'sent' ? 'text-green-600 border-green-600' : ''
                                            }>
                                                {log.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    {i < filteredLogs.length - 1 && <Separator />}
                                </motion.div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <AiDraftModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
            {isFaxModalOpen && (
                <SendFaxModal
                    assetId="" // Context required
                    institution="" // Context required
                    onClose={() => setIsFaxModalOpen(false)}
                    onSuccess={() => {
                        fetchLogs(); // Refresh logs after sending
                    }}
                />
            )}
        </div>
    );
};


export default Communications;
