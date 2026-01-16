import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const Checklist = () => {
    // California Probate Code Specific Tasks
    const [tasks, setTasks] = useState([
        { id: 1, title: 'File Petition for Probate (Form DE-111)', phase: 'Initial Filing', status: 'completed', deadline: 'Day 1-30' },
        { id: 2, title: 'Publish Notice to Creditors (Form DE-121)', phase: 'Notice', status: 'completed', deadline: 'Day 15' },
        { id: 3, title: 'Bond Calculation & Filing', phase: 'Bond', status: 'pending', deadline: 'Day 30', reason: 'Waiting for Estate Value' },
        { id: 4, title: 'File Inventory & Appraisal (Form DE-160)', phase: 'Inventory', status: 'pending', deadline: 'Month 4' },
        { id: 5, title: 'Send Notice of Admin to Franchise Tax Board', phase: 'Taxes', status: 'pending', deadline: 'Day 90' },
        { id: 6, title: 'File Final Petition for Distribution', phase: 'Closing', status: 'blocked', deadline: 'Month 7 (Minimum)', reason: 'Creditor Claim Period Open' },
    ]);

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const progress = (completedCount / tasks.length) * 100;

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                // Simple toggle for demo; in real app, might need more logic
                return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
            }
            return t;
        }));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Action Checklist</h1>
                    <p className="text-muted-foreground">California Estate Protocol • Day 12 of 30</p>
                </div>

                <div className="bg-card p-4 rounded-lg border shadow-sm space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Probate Tasks</CardTitle>
                    <CardDescription>
                        Key filings and deadlines for California probate administration.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Phase</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id} className={cn(task.status === 'completed' && "bg-muted/30")}>
                                    <TableCell>
                                        <Checkbox
                                            checked={task.status === 'completed'}
                                            onCheckedChange={() => toggleTask(task.id)}
                                            disabled={task.status === 'blocked'}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className={cn(task.status === 'completed' && "line-through text-muted-foreground")}>
                                            {task.title}
                                        </div>
                                        {task.status === 'blocked' && (
                                            <div className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Blocked: {task.reason}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{task.phase}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{task.deadline}</TableCell>
                                    <TableCell className="text-right">
                                        {task.status === 'completed' && <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600">Done</Badge>}
                                        {task.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                                        {task.status === 'blocked' && <Badge variant="destructive">Blocked</Badge>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Checklist;
