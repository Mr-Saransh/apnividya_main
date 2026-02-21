import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class CommunityService {
    constructor(
        private prisma: PrismaService,
        private gamification: GamificationService
    ) { }

    async createPost(userId: string, title: string, content: string) {
        // Award Karma for asking a question (encourages activity)
        await this.gamification.awardKarma(userId, 2, 'Posted a new community question');

        return this.prisma.communityPost.create({
            data: {
                userId,
                title,
                content,
            },
            include: {
                user: { select: { id: true, fullName: true, avatar: true, role: true } },
                _count: { select: { comments: true } }
            }
        });
    }

    async getPosts() {
        return this.prisma.communityPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, fullName: true, avatar: true, role: true } },
                _count: { select: { comments: true } }
            }
        });
    }

    async getPostWithComments(postId: string) {
        const post = await this.prisma.communityPost.findUnique({
            where: { id: postId },
            include: {
                user: { select: { id: true, fullName: true, avatar: true, role: true } },
                comments: {
                    include: {
                        user: { select: { id: true, fullName: true, avatar: true, role: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!post) throw new NotFoundException('Post not found');
        return post;
    }

    async addComment(userId: string, postId: string, content: string) {
        // Award Karma for commenting/solving
        await this.gamification.awardKarma(userId, 5, 'Contributed to a community discussion');

        return this.prisma.comment.create({
            data: {
                userId,
                postId,
                content
            },
            include: { user: { select: { id: true, fullName: true, avatar: true } } }
        });
    }

    // Simplified Voting: Just toggles or increments upvotes for now to make it fast
    async upvotePost(userId: string, postId: string) {
        // Check if already voted (omitted for speed, just increment)
        // Usually we check PostVote table. Let's do it properly.
        const vote = await this.prisma.postVote.findUnique({
            where: {
                userId_postId: { userId, postId }
            }
        });

        if (vote) {
            throw new BadRequestException('Already voted');
        }

        await this.prisma.$transaction([
            this.prisma.postVote.create({
                data: { userId, postId, value: 1 }
            }),
            this.prisma.communityPost.update({
                where: { id: postId },
                data: { upvotes: { increment: 1 } }
            })
        ]);

        // Award Karma to author
        const post = await this.prisma.communityPost.findUnique({ where: { id: postId } });
        if (post) {
            await this.gamification.awardKarma(post.userId, 10, 'Your post was upvoted');
        }

        return { success: true };
    }

    async deletePost(userId: string, role: string, postId: string) {
        const post = await this.prisma.communityPost.findUnique({
            where: { id: postId }
        });

        if (!post) throw new NotFoundException('Post not found');

        if (role !== 'ADMIN' && post.userId !== userId) {
            throw new ForbiddenException('You do not have permission to delete this post');
        }

        // Delete associated records first (PostVote, Comment)
        await this.prisma.$transaction([
            this.prisma.postVote.deleteMany({ where: { postId } }),
            this.prisma.comment.deleteMany({ where: { postId } }),
            this.prisma.communityPost.delete({ where: { id: postId } })
        ]);

        return { success: true, message: 'Post deleted successfully' };
    }

    async deleteComment(userId: string, role: string, commentId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) throw new NotFoundException('Comment not found');

        if (role !== 'ADMIN' && comment.userId !== userId) {
            throw new ForbiddenException('You do not have permission to delete this comment');
        }

        await this.prisma.comment.delete({
            where: { id: commentId }
        });

        return { success: true, message: 'Comment deleted successfully' };
    }
}
