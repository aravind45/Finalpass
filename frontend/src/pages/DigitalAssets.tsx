import { useState } from 'react';
import { Bitcoin, Cloud, Key, Shield, Plus, Lock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DigitalAssets = () => {
    // Mock data for MVP
    const [assets] = useState([
        { id: 1, type: 'crypto', name: 'Coinbase Exchange', value: 'Legacy Contact Active', icon: Bitcoin, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 2, type: 'cloud', name: 'Google Workspace', value: 'Primary Email', icon: Cloud, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 3, type: 'password', name: '1Password Master Key', value: 'Stored in Phyiscal Safe', icon: Key, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ]);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Digital Vault
                    </h1>
                    <p className="text-muted-foreground mt-1">Secure inventory for digital legacy, crypto, and passwords.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Digital Asset
                </Button>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                <div className="flex items-start gap-4">
                    <Lock className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Security Warning</h3>
                        <p className="text-sm text-red-700 mt-1">
                            Never store actual passwords, seed phrases, or private keys here. Only store <strong>location hints</strong> (e.g., "In the blue safe") or legacy contact instructions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {assets.map((asset) => (
                    <Card key={asset.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-2 rounded-xl", asset.bg)}>
                                    <asset.icon className={cn("w-6 h-6", asset.color)} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{asset.name}</h3>
                                    <p className="text-xs text-muted-foreground font-medium tracking-wide">{asset.type.toUpperCase()}</p>
                                </div>
                            </div>

                            <Badge variant="outline" className="text-sm font-normal py-1">
                                {asset.value}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DigitalAssets;
