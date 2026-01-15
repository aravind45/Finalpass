import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const Checklist = () => {
    // California Probate Code Specific Tasks
    const tasks = [
        { id: 1, title: 'File Petition for Probate (Form DE-111)', phase: 'Initial Filing', status: 'completed', deadline: 'Day 1-30' },
        { id: 2, title: 'Publish Notice to Creditors (Form DE-121)', phase: 'Notice', status: 'completed', deadline: 'Day 15' },
        { id: 3, title: 'Bond Calculation & Filing', phase: 'Bond', status: 'pending', deadline: 'Day 30', reason: 'Waiting for Estate Value' },
        { id: 4, title: 'File Inventory & Appraisal (Form DE-160)', phase: 'Inventory', status: 'pending', deadline: 'Month 4' },
        { id: 5, title: 'Send Notice of Admin to Franchise Tax Board', phase: 'Taxes', status: 'pending', deadline: 'Day 90' },
        { id: 6, title: 'File Final Petition for Distribution', phase: 'Closing', status: 'blocked', deadline: 'Month 7 (Minimum)', reason: 'Creditor Claim Period Open' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>Action Checklist</h1>
                <p style={{ color: '#64748b' }}>California Estate Protocol • Day 12 of 30</p>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {tasks.map((task, i) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: i !== tasks.length - 1 ? '1px solid #f1f5f9' : 'none',
                            background: task.status === 'completed' ? '#f8fafc' : 'white'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {task.status === 'completed' ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : task.status === 'blocked' ? (
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #ef4444', display: 'grid', placeItems: 'center' }}>
                                    <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>!</span>
                                </div>
                            ) : (
                                <Circle className="w-6 h-6 text-slate-300" />
                            )}

                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                    color: task.status === 'completed' ? '#94a3b8' : '#0f172a'
                                }}>
                                    {task.title}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                    {task.phase} • Due {task.deadline}
                                </p>
                            </div>
                        </div>

                        {task.status === 'blocked' && (
                            <span style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
                                Blocked: {task.reason}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Checklist;
