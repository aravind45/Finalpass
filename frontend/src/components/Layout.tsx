import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    MessageSquare,
    Users,
    LogOut,
    Menu,
    FolderOpen,
    Grid,
    Lock,
    Search,
    User
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


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

interface NavContentProps {
    setIsMobileOpen?: (open: boolean) => void;
    onLogout: () => void;
}

const NavContent = ({ setIsMobileOpen, onLogout }: NavContentProps) => {
    const location = useLocation();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Executor Person', email: 'executor@example.com' };

    return (
        <div className="flex flex-col h-full bg-background border-r">
            <div className="p-6 border-b flex items-center justify-center lg:justify-start">
                <h1 className="text-2xl font-bold text-foreground">
                    Expected<span className="text-primary">Estate</span>
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:text-primary",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                                onClick={() => setIsMobileOpen?.(false)}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t">
                <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-muted/50">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
};

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Executor Person', email: 'executor@example.com' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <NavContent onLogout={handleLogout} />
            </aside>

            {/* Mobile Header & Content */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden">
                                <span className="sr-only">Open sidebar</span>
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <NavContent setIsMobileOpen={setIsMobileOpen} onLogout={handleLogout} />
                        </SheetContent>
                    </Sheet>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1 items-center">
                            {/* Breadcrumbs or Title could go here */}
                            <h2 className="text-lg font-semibold text-foreground">
                                {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
