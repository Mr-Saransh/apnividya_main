"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    MessageSquare,
    ThumbsUp,
    Send,
    Plus,
    Award,
    User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
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

    const createPost = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) return;
        try {
            await api.post("/community/posts", {
                title: newPostTitle,
                content: newPostContent,
            });
            setNewPostTitle("");
            setNewPostContent("");
            setIsCreateOpen(false);
            fetchPosts();
        } catch (error) {
            console.error("Failed to create post:", error);
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

    const upvotePost = async (postId: string) => {
        try {
            await api.post(`/community/posts/${postId}/upvote`);
            fetchPosts(); // Refresh posts
            if (selectedPost?.id === postId) {
                viewPost(postId); // Refresh detail view
            }
        } catch (error: any) {
            console.error("Failed to upvote:", error);
            alert(error.response?.data?.message || "Failed to upvote");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Community</h1>
                    <p className="text-muted-foreground">Ask questions, solve problems, earn karma!</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Ask Question
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Ask a Question</DialogTitle>
                            <DialogDescription>
                                Share your problem with the community. You'll earn +2 karma!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Question title..."
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                            />
                            <Textarea
                                placeholder="Describe your problem in detail..."
                                value={newPostContent}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPostContent(e.target.value)}
                                rows={6}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={createPost} disabled={!newPostTitle.trim() || !newPostContent.trim()}>
                                Post Question
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                            <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                            <p className="text-muted-foreground mb-4">Be the first to ask a question!</p>
                            <Button onClick={() => setIsCreateOpen(true)}>Ask Question</Button>
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
                                            <CardTitle className="text-base mt-2">{post.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <button
                                            className="flex items-center gap-1 hover:text-primary transition-colors"
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                upvotePost(post.id);
                                            }}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{post.upvotes}</span>
                                        </button>
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
                                <CardTitle className="text-lg">Answers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                                    {selectedPost.comments.length === 0 ? (
                                        <p className="text-center text-sm text-muted-foreground py-8">
                                            No answers yet. Be the first to help!
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
                                                </div>
                                                <p className="text-sm">{comment.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Share your solution... (+5 karma)"
                                        value={commentContent}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
                                        rows={3}
                                    />
                                    <Button onClick={addComment} disabled={!commentContent.trim()} className="w-full gap-2">
                                        <Send className="h-4 w-4" />
                                        Submit Answer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="p-8 text-center sticky top-6">
                            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-semibold mb-2">How Karma Works</h3>
                            <div className="text-sm text-muted-foreground space-y-2 text-left">
                                <p>• Ask a question: <strong>+2 karma</strong></p>
                                <p>• Answer someone: <strong>+5 karma</strong></p>
                                <p>• Get upvoted: <strong>+10 karma</strong></p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
