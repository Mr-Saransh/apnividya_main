"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { useState } from "react";

export function TopNav({ onMenuClick, className }: { onMenuClick?: () => void, className?: string }) {
    const { user, logout } = useAuth();
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    return (
        <header className={cn("sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 md:px-6", className)}>

            {showMobileSearch ? (
                <div className="flex w-full items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = (e.currentTarget.elements.namedItem('mobile-search') as HTMLInputElement).value;
                            if (query.trim()) {
                                window.location.href = `/dashboard/courses?search=${encodeURIComponent(query)}`;
                            }
                        }}
                        className="flex-1 relative"
                    >
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            name="mobile-search"
                            placeholder="Search courses..."
                            autoFocus
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </form>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMobileSearch(false)}
                        className="text-muted-foreground"
                    >
                        Cancel
                    </Button>
                </div>
            ) : (
                <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
                    {/* Logo - Always Visible */}
                    <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 mr-auto">
                        <div className="h-8 w-8 flex-shrink-0">
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

                    {/* Right Side Actions */}
                    <div className="ml-auto flex items-center gap-2">
                        {/* Search Bar (Desktop) */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                                if (query.trim()) {
                                    window.location.href = `/dashboard/courses?search=${encodeURIComponent(query)}`;
                                }
                            }}
                            className="hidden md:flex items-center relative"
                        >
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                name="search"
                                placeholder="Search courses..."
                                className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </form>

                        {/* Mobile Search Button (Toggles Input) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                            onClick={() => setShowMobileSearch(true)}
                        >
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>

                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Theme Toggle */}
                        <ModeToggle />

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-muted"
                                >
                                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                                        <AvatarImage
                                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName || "User"}&background=3b82f6&color=fff`}
                                            alt={user?.fullName || "User"}
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user?.fullName?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.fullName || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                                    <Link href="/dashboard/profile" className="w-full">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </header>
    );
}
