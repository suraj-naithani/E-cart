import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-order.dto';
import { SellerGuard } from '../seller/seller.guard';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @UseGuards(JwtAuthGuard)
    @Post('new')
    async createOrder(@Req() req, @Body() createOrderDto: CreateProductDto) {
        const userId = req.user.userId;

        if (userId === createOrderDto.sellerId) {
            throw new BadRequestException('You cannot place an order for your own product');
        }

        return this.orderService.createOrder(userId, createOrderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-orders')
    async myOrders(@Req() req) {
        const userId = req.user.userId;
        return this.orderService.getUserOrders(userId);
    }

    @UseGuards(JwtAuthGuard, SellerGuard)
    @Get('all-orders')
    async getAllOrders(@Req() req: any) {
        try {
            const sellerId = req.user.userId;
            const orders = await this.orderService.getAllOrdersForSeller(sellerId);

            return {
                success: true,
                orders,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch orders');
        }
    }

    @Get('order/:id')
    async getSingleOrder(@Param('id') id: string) {
        try {
            const order = await this.orderService.getSingleOrder(id);

            return {
                success: true,
                order,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Order not found');
            } else {
                throw new InternalServerErrorException('Failed to fetch order');
            }
        }
    }

    @Put('order-process/:id')
    async processOrder(@Param('id') id: string) {
        try {
            const result = await this.orderService.updateOrderStatus(id);

            return {
                success: true,
                message: result.message,
                order: result.order,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            } else {
                throw new BadRequestException('Failed to process order');
            }
        }
    }


    @Post('/create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
      try {
        const { amount } = body;
        if (!amount) {
          throw new HttpException('Amount is required', HttpStatus.BAD_REQUEST);
        }

        const paymentIntent = await this.orderService.createPaymentIntent(amount);
        
        return { success: true, clientSecret: paymentIntent.clientSecret };
      } catch (error) {
        throw new HttpException(
          error.message || 'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    @Delete('delete/:id')
    async deleteOrder(@Param('id') id: string) {
        return await this.orderService.deleteOrder(id);
    }
}
