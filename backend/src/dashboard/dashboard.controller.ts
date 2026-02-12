import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics for current user' })
    async getDashboardStats(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.dashboardService.getDashboardStats(userId);
    }

    @Get('daily-challenge')
    @ApiOperation({ summary: 'Get daily challenge status' })
    async getDailyChallenge(@Req() req: any) {
        const userId = req.user.userId || req.user.sub;
        return this.dashboardService.getDailyChallenge(userId);
    }
}
