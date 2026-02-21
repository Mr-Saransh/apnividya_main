"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, ThumbsUp, Send, User as UserIcon, Trash2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Post {
    id: string;
    title: string;
    content: string;
    upvotes: number;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        avatar: string | null;
        role: string;
    };
    _count: {
        comments: number;
    };
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        avatar: string | null;
    };
}

interface PostDetail extends Post {
    comments: Comment[];
}

export default function AdminCommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get("/community/posts");
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const viewPost = async (postId: string) => {
        try {
            const response = await api.get(`/community/posts/${postId}`);
            setSelectedPost(response.data);
        } catch (error) {
            console.error("Failed to fetch post:", error);
        }
    };

    const addComment = async () => {
        if (!selectedPost || !commentContent.trim()) return;
        try {
            await api.post(`/community/posts/${selectedPost.id}/comments`, {
                content: commentContent,
            });
            setCommentContent("");
            viewPost(selectedPost.id); // Refresh comments
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const deletePost = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post as Admin?")) return;
        try {
            await api.delete(`/community/posts/${postId}`);
            if (selectedPost?.id === postId) {
                setSelectedPost(null);
            }
            fetchPosts();
        } catch (error: any) {
            console.error("Failed to delete post:", error);
            alert(error.response?.data?.message || "Failed to delete post");
        }
    };

    const deleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment as Admin?")) return;
        try {
            await api.delete(`/community/comments/${commentId}`);
            if (selectedPost) {
                viewPost(selectedPost.id);
            }
        } catch (error: any) {
            console.error("Failed to delete comment:", error);
            alert(error.response?.data?.message || "Failed to delete comment");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Community Moderation</h1>
                    <p className="text-muted-foreground">Monitor questions, remove inappropriate content, and answer students.</p>
                </div>
            </div>

            {/* Posts List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <Card className="p-6">
                            <p className="text-center text-muted-foreground">Loading posts...</p>
                        </Card>
                    ) : posts.length === 0 ? (
                        <Card className="p-10 text-center">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No community activity</h3>
                            <p className="text-muted-foreground">The forum is currently empty.</p>
                        </Card>
                    ) : (
                        posts.map((post) => (
                            <Card
                                key={post.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:shadow-md",
                                    selectedPost?.id === post.id && "border-primary shadow-md"
                                )}
                                onClick={() => viewPost(post.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage
                                                src={post.user.avatar || undefined}
                                                alt={post.user.fullName}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {post.user.fullName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-sm">{post.user.fullName}</span>
                                                <Badge variant="secondary" className="text-[10px]">{post.user.role}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div className="flex items-start justify-between mt-2">
                                                <CardTitle className="text-base">{post.title}</CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deletePost(post.id);
                                                    }}
                                                    title="Delete Post (Admin)"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{post.upvotes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{post._count.comments}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Post Detail / Info Panel */}
                <div className="lg:col-span-1">
                    {selectedPost ? (
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Discussion Thread</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                                    {selectedPost.comments.length === 0 ? (
                                        <p className="text-center text-sm text-muted-foreground py-8">
                                            No answers yet.
                                        </p>
                                    ) : (
                                        selectedPost.comments.map((comment) => (
                                            <div key={comment.id} className="bg-muted/30 p-3 rounded-lg space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6 border border-border">
                                                        <AvatarImage
                                                            src={comment.user.avatar || undefined}
                                                            alt={comment.user.fullName}
                                                        />
                                                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                                                            {comment.user.fullName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-semibold">{comment.user.fullName}</span>
                                                    <span className="text-xs text-muted-foreground ml-auto">
                                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10 ml-2"
                                                        onClick={() => deleteComment(comment.id)}
                                                        title="Delete Comment (Admin)"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm">{comment.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Add an admin response..."
                                        value={commentContent}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
                                        rows={3}
                                    />
                                    <Button onClick={addComment} disabled={!commentContent.trim()} className="w-full gap-2">
                                        <ShieldAlert className="h-4 w-4" />
                                        Post Admin Reply
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="p-8 text-center sticky top-6">
                            <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="font-semibold mb-2">Moderation Tools</h3>
                            <div className="text-sm text-muted-foreground space-y-2 text-left">
                                <p>• Read through community discussions.</p>
                                <p>• Delete inappropriate posts or comments.</p>
                                <p>• Provide official answers marked by the Admin role.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
