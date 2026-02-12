"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, FileVideo, Users, Settings, LogOut, Menu, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
    },
    {
        title: "Lessons",
        href: "/admin/lessons",
        icon: FileVideo,
    },
    {
        title: "Mock Tests",
        href: "/admin/mock-tests",
        icon: Trophy,
    },
    {
        title: "Submissions",
        href: "/admin/submissions",
        icon: Users,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-background">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-20">
                <div className="font-bold text-lg text-primary">Admin Panel</div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold tracking-tight text-primary">Admin Panel</h2>
                            <p className="text-sm text-muted-foreground">Apni Vidya Manager</p>
                        </div>
                        <nav className="flex-1 space-y-1 p-4">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                        pathname.startsWith(item.href)
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                        <div className="p-4 border-t mt-auto">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                    if (confirm("Are you sure you want to log out?")) {
                                        localStorage.removeItem('accessToken');
                                        window.location.href = '/login';
                                    }
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r bg-muted/10 flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight text-primary">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground">Apni Vidya Manager</p>
                </div>
                <nav className="flex-1 space-y-1 px-4">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                pathname.startsWith(item.href)
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                            if (confirm("Are you sure you want to log out?")) {
                                localStorage.removeItem('accessToken');
                                window.location.href = '/login';
                            }
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
