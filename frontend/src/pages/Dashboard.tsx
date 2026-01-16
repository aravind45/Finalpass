import { motion } from 'framer-motion';
import { Heart, AlertCircle, Clock, CheckCircle2, ChevronRight, FileText, DollarSign, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Asset {
    id: string;
    institution: string;
    type: string;
    value: string | number | { s: number; e: number; d: number[] };
    status: string;
    metadata: string;
    requirements: string;
}

interface Estate {
    name: string;
    status: string;
    assets: Asset[];
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [estate, setEstate] = useState<Estate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/estates/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setEstate(data.estate);
                }
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getUrgency = (metadata: string) => {
        try {
            const meta = JSON.parse(metadata);
            return meta.urgency || 'low';
        } catch { return 'low'; }
    };

    const getStatusInfo = (status: string) => {
        const statusMap: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
            'CONTACTED': { label: 'In Progress', color: 'text-amber-600', icon: Clock, bg: 'bg-amber-100' },
            'DISTRIBUTED': { label: 'Complete', color: 'text-emerald-600', icon: CheckCircle2, bg: 'bg-emerald-100' },
            'Processing': { label: 'Processing', color: 'text-blue-600', icon: Activity, bg: 'bg-blue-100' },
        };
        return statusMap[status] || { label: status, color: 'text-slate-500', icon: Clock, bg: 'bg-slate-100' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const urgentAssets = estate?.assets.filter(a => getUrgency(a.metadata) === 'high') || [];
    const inProgressAssets = estate?.assets.filter(a => a.status === 'CONTACTED') || [];
    const completedAssets = estate?.assets.filter(a => a.status === 'DISTRIBUTED') || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalValue = estate?.assets.reduce((sum, asset) => sum + parseFloat(asset.value as any || 0), 0) || 0;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return (
        <div className="p-6 space-y-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-full">
                        <Heart className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {user?.name ? `Welcome back, ${user.name}` : (estate?.name || 'Your Estate')}
                        </h1>
                        <p className="text-muted-foreground">
                            {estate?.name ? `Managing: ${estate.name}` : 'Estate Overview'}
                        </p>
                    </div>
                </div>
                <p className="text-muted-foreground max-w-2xl mt-2">
                    We are here to help you navigate the estate settlement process, step by step.
                </p>
            </motion.div>

            {/* Urgent Actions Alert */}
            {urgentAssets.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
                        <CardContent className="flex items-start gap-4 p-4">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 dark:text-red-200">Action Needed</h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    {urgentAssets.length} {urgentAssets.length === 1 ? 'asset needs' : 'assets need'} your attention.
                                    These institutions haven't responded in over 14 days.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{estate?.assets.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Accounts tracking</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Est. Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total estate value</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Activity className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressAssets.length}</div>
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedAssets.length}</div>
                        <p className="text-xs text-muted-foreground">Assets distributed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Assets List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Your Assets</h2>
                        <p className="text-sm text-muted-foreground">Review status and recent activity</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {estate?.assets.map((asset, index) => {
                        const urgency = getUrgency(asset.metadata);
                        const statusInfo = getStatusInfo(asset.status);
                        const StatusIcon = statusInfo.icon;
                        const meta = JSON.parse(asset.metadata || '{}');
                        const reqs = JSON.parse(asset.requirements || '{}');

                        return (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={cn(
                                        "hover:bg-muted/50 transition-colors cursor-pointer",
                                        urgency === 'high' && "border-l-4 border-l-red-500"
                                    )}
                                    onClick={() => navigate(`/assets/${asset.id}`)}
                                >
                                    <div className="flex items-center p-4 gap-4">
                                        <div className={cn("p-2 rounded-full hidden sm:block", statusInfo.bg)}>
                                            <StatusIcon className={cn("w-5 h-5", statusInfo.color)} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold truncate pr-4">{asset.institution}</h3>
                                                <span className="font-bold text-foreground">
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    ${parseFloat(asset.value as any).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <span>{asset.type}</span>
                                                    <span>•</span>
                                                    <span className={cn("font-medium", statusInfo.color)}>{statusInfo.label}</span>
                                                </div>
                                                {meta.lastContact && (
                                                    <div className="text-muted-foreground hidden sm:block">
                                                        Last: {new Date(meta.lastContact).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            {urgency === 'high' && reqs.urgentAction && (
                                                <div className="mt-2 text-xs font-medium text-red-600 bg-red-50 p-1.5 rounded inline-block">
                                                    Action needed: {reqs.urgentAction}
                                                </div>
                                            )}
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Helpful Actions */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="font-semibold text-lg">Need to add documents?</h3>
                        <p className="text-sm text-muted-foreground">
                            Upload death certificates, wills, or other estate documents to keep everything organized.
                        </p>
                    </div>
                    <Button onClick={() => navigate('/intake')} size="lg">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Documents
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
