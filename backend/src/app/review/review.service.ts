import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './schema/review.schema';
import { Order } from '../order/schema/order.schema';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/schema/user.schema';
import { Product } from '../seller/schema/product.schema';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review) private readonly reviewModel: typeof Review,
        @InjectModel(Order) private readonly orderModel: typeof Order,
        @InjectModel(Product) private readonly productModel: typeof Product
    ) { }

    async createReview(userId: any, productId: any, rating: number, comment: string) {
        if (userId === productId) {
            throw new HttpException(
                'You cannot review your own product',
                HttpStatus.BAD_REQUEST,
            );
        }

        const userOrder = await this.orderModel.findOne({
            where: { userId, productId, status: 'Delivered' },
        });

        if (!userOrder) {
            throw new HttpException(
                'You can only review products you have purchased and that are delivered.',
                HttpStatus.FORBIDDEN,
            );
        }

        const review = await this.reviewModel.create({
            userId,
            productId,
            rating,
            comment,
        });

        return review;
    }


    async getProductReviews(productId: string) {
        try {
            const reviews = await this.reviewModel.findAll({
                where: { productId }, 
                include: [
                    {
                        model: User, // Assuming you have defined a User model
                        attributes: ['name'], // Fetch only the name field
                    },
                ],

            });

            const totalReviews = await this.reviewModel.count({
                where: { productId },
            });

            const [totalRating] = await this.reviewModel.findAll({
                where: { productId },
                attributes: [[this.reviewModel.sequelize.fn('AVG', this.reviewModel.sequelize.col('rating')), 'totalRating']],
                raw: true,
            });

            const totalStarsGroup = await this.reviewModel.findAll({
                where: { productId },
                attributes: [
                    'rating',
                    [this.reviewModel.sequelize.fn('COUNT', this.reviewModel.sequelize.col('rating')), 'count'],
                ],
                group: ['rating'],
                order: [['rating', 'DESC']],
                raw: true,
            });

            const stats = {
                reviews,
                totalReviews,
                totalRatings: totalRating,
                totalStarsGroup,
            };

            return stats;
        } catch (error) {
            throw new Error('Error fetching reviews');
        }
    }


    async getMyProductReviews(sellerId: string) {
        try {
            const products = await this.productModel.findAll({
                where: { sellerId },
            });

            if (!products || products.length === 0) {
                throw new HttpException(
                    'No products found for this seller',
                    HttpStatus.NOT_FOUND,
                );
            }

            const productIds = products.map((product) => product.id);

            const reviews = await this.reviewModel.findAll({
                where: { productId: productIds },
                include: [
                    {
                        model: User, // Include User table and fetch only 'name'
                        attributes: ['name'], // Only get the name attribute
                    }
                ],
            });

            return {
                success: true,
                reviews,
            };
        } catch (error) {
            throw new HttpException(
                `Error fetching reviews: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteReview(req: any, res: any) {
        try {
            const { reviewId } = req.params;
            const sellerId = req.user;

            const review = await this.reviewModel.findByPk(reviewId);

            if (!review) {
                return res.status(404).json({
                    success: false,
                    message: "Review not found",
                });
            }

            const product = await this.productModel.findByPk(review.productId);

            // if (!product || product.sellerId !== sellerId) {
            //     return res.status(403).json({
            //         success: false,
            //         message: "You are not authorized to delete this review",
            //     });
            // }

            await this.reviewModel.destroy({ where: { id: reviewId } });

            res.status(200).json({
                success: true,
                message: "Review deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error deleting review",
                error,
            });
        }
    }
}
