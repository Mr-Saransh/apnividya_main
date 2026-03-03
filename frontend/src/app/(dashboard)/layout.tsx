"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { LayoutDashboard, BookOpen, User, Trophy, MessageSquare, BrainCircuit, Medal, FolderKanban, MoreHorizontal, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background flex-col md:flex-row pb-16 md:pb-0">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r bg-card fixed h-full z-40">
                <Sidebar />
            </aside>

            <div className="flex-1 flex flex-col md:ml-64">
                <TopNav className="border-b sticky top-0 z-30" />

                {/* Main Content */}
                <main className="flex-1 bg-muted/10 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg z-50 pb-safe">
                <BottomNav />
            </div>

            {/* Mobile Sidebar Sheet (hamburger) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main navigation sidebar</SheetDescription>
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                        <Sidebar />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function BottomNav() {
    const pathname = usePathname();

    const routes = [
        {
            label: "Academic",
            icon: BrainCircuit,
            href: "/dashboard/academic",
            active: pathname.startsWith("/dashboard/academic"),
        },
        {
            label: "Skills",
            icon: Zap,
            href: "/dashboard/skills",
            active: pathname.startsWith("/dashboard/skills"),
        },
        {
            label: "Compete",
            icon: Medal,
            href: "/dashboard/competitions",
            active: pathname.startsWith("/dashboard/competitions"),
        },
        {
            label: "Portfolio",
            icon: FolderKanban,
            href: "/dashboard/portfolio",
            active: pathname.startsWith("/dashboard/portfolio"),
        },
    ];

    return (
        <nav className="grid grid-cols-4 h-16 px-2">
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 font-medium text-muted-foreground transition-all duration-200 active:scale-95 py-1 relative",
                        route.active ? "text-primary scale-105" : "hover:text-primary"
                    )}
                >
                    <div className={cn(
                        "absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-md transition-all duration-300 opacity-0",
                        route.active && "opacity-100 top-0"
                    )} />
                    <route.icon className={cn(
                        "h-5 w-5 transition-all duration-200",
                        route.active && "fill-primary/20 text-primary"
                    )} />
                    <span className="text-[10px] font-semibold">{route.label}</span>
                </Link>
            ))}
        </nav>
    );
}
