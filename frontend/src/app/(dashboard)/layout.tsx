"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col pb-16 md:pb-0">
            <TopNav className="border-b" />

            <div className="flex-1 flex">
                {/* Desktop Sidebar */}
                <aside className="hidden w-64 border-r bg-background md:block fixed h-full pt-16">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-muted/10 p-4 md:p-6 lg:p-8 md:ml-64">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
                <BottomNav />
            </div>
        </div>
    );
}

import { LayoutDashboard, BookOpen, User, Trophy, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function BottomNav() {
    const pathname = usePathname();

    const routes = [
        {
            label: "Home",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Courses",
            icon: BookOpen,
            href: "/dashboard/courses",
            active: pathname.startsWith("/dashboard/courses"),
        },
        {
            label: "Tests",
            icon: Trophy,
            href: "/dashboard/mock-test",
            active: pathname.startsWith("/dashboard/mock-test"),
        },
        {
            label: "Community",
            icon: MessageSquare,
            href: "/dashboard/community",
            active: pathname.startsWith("/dashboard/community"),
        },
        {
            label: "Profile",
            icon: User,
            href: "/dashboard/profile",
            active: pathname.startsWith("/dashboard/profile"),
        },
    ];

    return (
        <nav className="grid grid-cols-5 h-16">
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary",
                        route.active && "text-primary"
                    )}
                >
                    <route.icon className={cn("h-6 w-6", route.active && "fill-current")} />
                    <span className="text-[10px]">{route.label}</span>
                </Link>
            ))}
        </nav>
    );
}
