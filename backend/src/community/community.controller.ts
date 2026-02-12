import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Community')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    @Post('posts')
    @ApiOperation({ summary: 'Create a new community post/question' })
    createPost(
        @Req() req: any,
        @Body('title') title: string,
        @Body('content') content: string
    ) {
        return this.communityService.createPost(req.user.userId, title, content);
    }

    @Get('posts')
    @ApiOperation({ summary: 'Get all community posts' })
    getPosts() {
        return this.communityService.getPosts();
    }

    @Get('posts/:id')
    @ApiOperation({ summary: 'Get a specific post with all comments' })
    getPost(@Param('id') id: string) {
        return this.communityService.getPostWithComments(id);
    }

    @Post('posts/:id/comments')
    @ApiOperation({ summary: 'Add a comment/answer to a post' })
    addComment(
        @Req() req: any,
        @Param('id') postId: string,
        @Body('content') content: string
    ) {
        return this.communityService.addComment(req.user.userId, postId, content);
    }

    @Post('posts/:id/upvote')
    @ApiOperation({ summary: 'Upvote a post' })
    upvotePost(@Req() req: any, @Param('id') postId: string) {
        return this.communityService.upvotePost(req.user.userId, postId);
    }
}
