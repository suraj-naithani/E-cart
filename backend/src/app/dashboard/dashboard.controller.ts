import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SellerGuard } from '../seller/seller.guard';
import { AdminGuard } from './admin.guard';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('seller')
    @UseGuards(JwtAuthGuard, SellerGuard)
    async sellerDashboard(@Req() req, @Res() res) {
        try {
            const sellerId = req.user.userId;

            const stats = await this.dashboardService.getSellerDashboardStats(sellerId);

            return res.status(201).json({
                success: true,
                message: 'Dashboard Stats',
                stats,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: 'Error in getting seller dashboard',
                error,
            });
        }
    }
    @Get('admin')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async adminDashboard(@Req() req, @Res() res) {
        try {
            const stats = await this.dashboardService.getAdminDashboardStats();

            return res.status(201).json({
                success: true,
                message: "Dashboard Stats",
                stats,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Error in getting admin dashboard",
                error,
            });
        }
    }
}
