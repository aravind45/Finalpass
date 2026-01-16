import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Gem, // For Assets
    CheckSquare, // For Checklist
    MessageSquare, // For Communications
    Users, // For Family
    LogOut,
    Menu,
    X,
    FolderOpen // For Intake/Scan
} from 'lucide-react';
import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/intake', label: 'Scan Intake', icon: FolderOpen },
        { path: '/assets', label: 'Assets', icon: Grid },
        { path: '/digital-assets', label: 'Digital Vault', icon: Lock },
        { path: '/discovery', label: 'Detective', icon: Search },
        { path: '/checklist', label: 'Checklist', icon: CheckSquare },
        { path: '/documents', label: 'Documents', icon: FileText },
        { path: '/communications', label: 'Communications', icon: MessageSquare },
        { path: '/family', label: 'Family & Updates', icon: Users },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 50,
                    padding: '0.5rem',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'none' // Hidden on desktop via CSS ideally, but simplified here
                }}
                className="mobile-toggle"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '0px' }}
                style={{
                    background: 'white',
                    borderRight: '1px solid #e2e8f0',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 40
                }}
            >
                <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        Expected<span style={{ color: '#3b82f6' }}>Estate</span>
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Est. John Doe</p>
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            color: isActive ? '#2563eb' : '#64748b',
                                            background: isActive ? '#eff6ff' : 'transparent',
                                            textDecoration: 'none',
                                            fontWeight: isActive ? 600 : 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: isSidebarOpen ? '280px' : '0px',
                transition: 'margin-left 0.3s ease',
                width: '100%'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
