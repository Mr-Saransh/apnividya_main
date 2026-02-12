import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    @Get()
    @ApiOperation({ summary: 'Get all notifications for current user' })
    async getAllNotifications(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.notificationService.getUserNotifications(userId);
    }

    @Get('unread')
    @ApiOperation({ summary: 'Get unread notifications' })
    async getUnreadNotifications(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.notificationService.getUserNotifications(userId, true);
    }

    @Get('count')
    @ApiOperation({ summary: 'Get unread notification count' })
    async getUnreadCount(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        const count = await this.notificationService.getUnreadCount(userId);
        return { count };
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    async markAsRead(@Param('id') id: string, @Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.notificationService.markAsRead(id, userId);
    }

    @Patch('mark-all-read')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    async markAllAsRead(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.notificationService.markAllAsRead(userId);
    }
}
