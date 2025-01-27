import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { AddToCartDto } from './dto/cart.dto';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../seller/schema/product.schema';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add-to-cart')
    @UseGuards(JwtAuthGuard)
    async addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: any, @Res() res: Response) {
        try {
            const { productId, quantity } = addToCartDto;
            const userId = req.user.userId;

            const cart = await this.cartService.addToCart(userId, productId, quantity);

            return res.status(200).json({
                success: true,
                message: 'Product added to cart',
                cart,
            });
        } catch (error) {
            console.error(error);
            throw new HttpException(
                {
                    success: false,
                    message: 'Error adding product to cart',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('cart-product')
    @UseGuards(JwtAuthGuard)
    async getCart(@Req() req: Request, @Res() res: Response) {
        try {
            const userId = (req as any).user.userId; // Assuming `req.user` contains the authenticated user's data.
            const cart = await this.cartService.getCart(userId);

            if (!cart) {
                return res.status(200).json({
                    success: true,
                    message: 'Cart is empty',
                    cart: { items: [] },
                });
            }

            const itemsWithDetails = [];
            for (let item of cart.items) {
                const productDetails = await Product.findByPk(item.productId);  // Fetch product details by productId

                if (productDetails) {
                    itemsWithDetails.push({
                        quantity: item.quantity,
                        product: productDetails,
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Cart fetched successfully',
                cart: {
                    id: cart.id,
                    userId: cart.userId,
                    items: itemsWithDetails,
                    createdAt: cart.createdAt,
                    updatedAt: cart.updatedAt,
                },
            });
        } catch (error) {
            console.error(error);
            throw new HttpException(
                {
                    success: false,
                    message: 'Error fetching cart',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('decrease-quantity')
    @UseGuards(JwtAuthGuard)
    async decreaseQuantity(
        @Body('productId') productId: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const userId = (req as any).user.userId;
            const cart = await this.cartService.decreaseQuantity(userId, productId);

            return res.status(200).json({
                success: true,
                message: 'Product quantity decreased or removed from cart',
                cart,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            throw error;
        }
    }

    @Post('remove-from-cart')
    @UseGuards(JwtAuthGuard)
    async removeFromCart(
        @Body('productId') productId: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const userId = (req as any).user.userId;
            const cart = await this.cartService.removeFromCart(userId, productId);

            return res.status(200).json({
                success: true,
                message: 'Product removed from cart',
                cart,
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Error removing product from cart',
                error: error.message,
            });
        }
    }
}
