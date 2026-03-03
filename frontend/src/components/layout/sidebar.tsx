"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    BrainCircuit,
    Medal,
    FolderKanban,
    Zap,
    ChevronLeft,
} from "lucide-react";
import React from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const routes: { label: string; icon: React.ElementType; href: string; active: boolean }[] = [];

    const exploreRoutes = [
        {
            label: "Academic Portal",
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
            label: "Competitions",
            icon: Medal,
            href: "/dashboard/competitions",
            active: pathname.startsWith("/dashboard/competitions"),
        },
        {
            label: "My Portfolio",
            icon: FolderKanban,
            href: "/dashboard/portfolio",
            active: pathname.startsWith("/dashboard/portfolio"),
        },
    ];

    return (
        <div className={cn("flex flex-col h-full bg-card border-r border-border", className)}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/dashboard/academic" className="flex items-center gap-2">
                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm">
                        <Image
                            src="/logo-new.png"
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

            <div className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 w-full px-4 py-2.5 mb-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-200 border border-border/50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                </button>

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

                <div className="pt-2" />

                {exploreRoutes.map((route) => (
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
