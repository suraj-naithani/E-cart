import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @UseGuards(JwtAuthGuard)
    @Post('postReview/:productId')
    async createReview(
        @Req() req: any,
        @Param('productId') productId: any,
        @Body() createReviewDto: CreateReviewDto) {
        const userId = req.user.userId;

        const { rating, comment } = createReviewDto;

        const review = await this.reviewService.createReview(userId, productId, rating, comment);

        return {
            success: true,
            message: 'Review added successfully',
            review,
        };
    }

    @Get('/get-review/:productId')
    async getProductReviews(@Param('productId') productId: string) {
        try {
            const stats = await this.reviewService.getProductReviews(productId);
            return {
                success: true,
                stats,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error fetching reviews',
                error: error.message,
            };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-product-reviews')
    async getMyProductReviews(@Req() req) {
        const sellerId = req.user.userId;
        return this.reviewService.getMyProductReviews(sellerId);
    }

    @Delete('deleteReview/:reviewId')
    async deleteReview(@Param() params: any, @Req() req: any, @Res() res: any) {
        return this.reviewService.deleteReview(req, res);
    }
}   
