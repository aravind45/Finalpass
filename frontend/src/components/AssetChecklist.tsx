import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, FileText, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChecklistItem {
    id: string;
    itemName: string;
    itemType: string;
    description: string | null;
    required: boolean;
    completed: boolean;
    completedDate: string | null;
}

interface AssetChecklistProps {
    assetId: string;
}

const AssetChecklist = ({ assetId }: AssetChecklistProps) => {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChecklist = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/assets/${assetId}/checklist`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setItems(data.checklist);
            }
        } catch (error) {
            console.error('Failed to fetch checklist:', error);
            setError('Failed to load checklist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklist();
    }, [assetId]);

    const toggleItem = async (itemId: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/assets/checklist/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !currentStatus })
            });

            if (response.ok) {
                setItems(items.map(item =>
                    item.id === itemId ? { ...item, completed: !currentStatus } : item
                ));
            }
        } catch (error) {
            console.error('Failed to toggle checklist item:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                Settlement Checklist
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                    {items.filter(i => i.completed).length}/{items.length} Complete
                </span>
            </h3>

            <div className="grid gap-2">
                {items.map((item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id}
                        className={`p-4 rounded-lg border transition-all ${item.completed
                                ? 'bg-muted/30 border-border'
                                : 'bg-card border-border hover:border-primary/50'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <button
                                onClick={() => toggleItem(item.id, item.completed)}
                                className="mt-0.5 flex-shrink-0"
                            >
                                {item.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                        {item.itemName}
                                    </span>
                                    {item.required && !item.completed && (
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                            Required
                                        </span>
                                    )}
                                </div>
                                {item.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {item.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                    <span className="capitalize px-1.5 py-0.5 bg-muted rounded">
                                        {item.itemType}
                                    </span>
                                    {item.completedDate && (
                                        <span>• Completed {new Date(item.completedDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            {item.itemType === 'form' && !item.completed && (
                                <FileText className="w-5 h-5 text-primary opacity-50" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AssetChecklist;
