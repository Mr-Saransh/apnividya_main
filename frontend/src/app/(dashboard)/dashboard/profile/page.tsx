"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Calendar, Award, BookOpen, MessageSquare, PenTool, Edit2, Trophy, Star, Zap } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    bio: string | null;
    avatar: string | null;
    role: string;
    karmaPoints: number;
    createdAt: string;
    _count: {
        enrollments: number;
        posts: number;
        comments: number;
    };
}

interface BadgeInfo {
    id: string;
    label: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    condition: (profile: UserProfile) => boolean;
}

const BADGE_SYSTEM: BadgeInfo[] = [
    {
        id: "top_contributor",
        label: "Top Contributor",
        description: "Earned 100+ karma points",
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
        icon: <Trophy className="h-3 w-3" />,
        condition: (p) => p.karmaPoints >= 100
    },
    {
        id: "karma_master",
        label: "Karma Master",
        description: "Earned 500+ karma points",
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200",
        icon: <Star className="h-3 w-3" />,
        condition: (p) => p.karmaPoints >= 500
    },
    {
        id: "active_learner",
        label: "Active Learner",
        description: "Enrolled in 3+ courses",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200",
        icon: <BookOpen className="h-3 w-3" />,
        condition: (p) => p._count.enrollments >= 3
    },
    {
        id: "learner",
        label: "Learner",
        description: "Enrolled in at least 1 course",
        color: "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
        icon: <BookOpen className="h-3 w-3" />,
        condition: (p) => p._count.enrollments >= 1
    },
    {
        id: "community_helper",
        label: "Community Helper",
        description: "Posted 10+ answers",
        color: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
        icon: <MessageSquare className="h-3 w-3" />,
        condition: (p) => p._count.comments >= 10
    },
    {
        id: "question_asker",
        label: "Curious Mind",
        description: "Posted 5+ questions",
        color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200",
        icon: <PenTool className="h-3 w-3" />,
        condition: (p) => p._count.posts >= 5
    },
    {
        id: "early_adopter",
        label: "Early Adopter",
        description: "Joined in the first month",
        color: "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200",
        icon: <Zap className="h-3 w-3" />,
        condition: (p) => {
            const joinDate = new Date(p.createdAt);
            const cutoff = new Date('2026-02-01');
            return joinDate <= cutoff;
        }
    }
];

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: "", bio: "", avatar: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/auth/me");
            setProfile(response.data);
            setEditForm({
                fullName: response.data.fullName || "",
                bio: response.data.bio || "",
                avatar: response.data.avatar || ""
            });
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            const response = await api.post("/auth/me", editForm);
            setProfile(response.data);
            setIsEditOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const earnedBadges = profile ? BADGE_SYSTEM.filter(badge => badge.condition(profile)) : [];
    const lockedBadges = profile ? BADGE_SYSTEM.filter(badge => !badge.condition(profile)) : [];

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!profile) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Failed to load profile.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-background to-muted/20">
                <CardContent className="p-6 sm:p-10">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl">
                            <AvatarImage
                                src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random&color=fff`}
                                alt={profile.fullName}
                            />
                            <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left space-y-2 flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                {profile.fullName}
                            </h1>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {profile.role}
                                </Badge>
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Joined {format(new Date(profile.createdAt), "MMMM yyyy")}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-md">
                                {profile.bio || "No bio added yet. Click 'Edit Profile' to add one!"}
                            </p>
                        </div>
                        <div className="sm:ml-auto flex gap-3">
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Edit2 className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your profile information. Changes will be saved immediately.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                value={editForm.fullName}
                                                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={editForm.bio}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({ ...editForm, bio: e.target.value })}
                                                placeholder="Tell us about yourself..."
                                                rows={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar">Avatar URL (optional)</Label>
                                            <Input
                                                id="avatar"
                                                value={editForm.avatar}
                                                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                                                placeholder="https://example.com/your-avatar.jpg"
                                            />
                                            <p className="text-xs text-muted-foreground">Leave blank for default avatar</p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleUpdateProfile} disabled={saving}>
                                            {saving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Karma Points</CardTitle>
                            <Award className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-600">{profile.karmaPoints}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Earned from community contributions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile._count.enrollments}</div>
                            <p className="text-xs text-muted-foreground">
                                Active learning journeys
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
                            <PenTool className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile._count.posts}</div>
                            <p className="text-xs text-muted-foreground">
                                Questions and topics shared
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Answers Given</CardTitle>
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profile._count.comments}</div>
                            <p className="text-xs text-muted-foreground">
                                Helpful responses
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Contact + Badges */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{profile.email}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Badges ({earnedBadges.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Unlocked</h4>
                                <div className="flex flex-wrap gap-2">
                                    {earnedBadges.length > 0 ? (
                                        earnedBadges.map((badge) => (
                                            <Badge
                                                key={badge.id}
                                                variant="secondary"
                                                className={`${badge.color} gap-1 text-xs`}
                                                title={badge.description}
                                            >
                                                {badge.icon}
                                                {badge.label}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No badges yet. Keep contributing!</p>
                                    )}
                                </div>
                            </div>

                            {lockedBadges.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Locked</h4>
                                        <div className="space-y-2">
                                            {lockedBadges.slice(0, 3).map((badge) => (
                                                <div key={badge.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                    <div className="mt-0.5">{badge.icon}</div>
                                                    <div>
                                                        <p className="font-medium">{badge.label}</p>
                                                        <p className="text-[10px]">{badge.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Card className="p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2 text-center sm:text-left flex-1">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-6">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-12" />
                        </Card>
                    ))}
                </div>
                <Card className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                </Card>
            </div>
        </div>
    );
}
