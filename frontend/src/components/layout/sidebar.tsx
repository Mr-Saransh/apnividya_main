"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    User,
    Users,
} from "lucide-react";
import React from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "My Courses",
            icon: BookOpen,
            href: "/dashboard/courses",
            active: pathname.startsWith("/dashboard/courses"),
        },
        {
            label: "Mock Tests",
            icon: Trophy,
            href: "/dashboard/mock-test",
            active: pathname.startsWith("/dashboard/mock-test"),
        },
        {
            label: "Community",
            icon: Users,
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
        <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm">
                        <Image
                            src="/logo.png"
                            alt="Apni Vidya Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                    <span className="text-lg font-bold text-primary whitespace-nowrap">Apni Vidya</span>
                </Link>
            </div>

            <div className="flex-1 px-4 space-y-1 py-4">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200",
                            route.active
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <route.icon
                            className={cn(
                                "h-5 w-5 flex-shrink-0",
                                route.active ? "text-primary-foreground" : "text-muted-foreground"
                            )}
                        />
                        <span>{route.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

