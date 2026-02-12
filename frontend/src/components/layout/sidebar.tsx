"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
            <div className="h-4" />
            <div className="flex-1 px-4 space-y-1 py-6">
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

