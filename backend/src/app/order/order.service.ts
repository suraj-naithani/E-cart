import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './schema/order.schema';
import { CreateProductDto } from './dto/create-order.dto';
import { Product } from '../seller/schema/product.schema';
import { User } from '../users/schema/user.schema';
import { Sequelize } from 'sequelize-typescript';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
    private stripe: Stripe;

    constructor(
      @InjectModel(Order) private readonly orderModel: typeof Order,
      @InjectModel(User) private readonly userModel: typeof User,
      @InjectModel(Product) private readonly productModel: typeof Product,
    ) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createOrder(userId: number, createOrderDto: CreateProductDto) {
        const { shippingInfo, shippingCharges, discount, total, orderItem, productId, sellerId } =
            createOrderDto;

        if (!shippingInfo || !total || !orderItem) {
            throw new BadRequestException('Missing required fields or invalid order items');
        }

        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            throw new BadRequestException('Product does not exist');
        }

        try {
            const order = await this.orderModel.create({
                shippingInfo,
                userId,
                shippingCharges,
                discount,
                total,
                orderItem,
                productId,
                sellerId,
            });

            await this.reduceStock(orderItem, productId);

            return {
                success: true,
                message: 'Order placed successfully',
                order,
            };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Order not placed');
        }
    }

    private async reduceStock(orderItem: any, productId: any) {
        const product = await Product.findOne({ where: { id: productId } });

        if (!product) {
            throw new BadRequestException(`Product with ID ${productId} does not exist`);
        }

        if (product.stock < orderItem.quantity) {
            throw new BadRequestException(
                `Insufficient stock for product ${orderItem.name}. Available: ${product.stock}, Required: ${orderItem.quantity}`
            );
        }

        product.stock -= orderItem.quantity;
        await product.save();

    }

    async getUserOrders(userId: number) {
        try {
            const orders = await this.orderModel.findAll({
                where: { userId },
            });

            if (!orders.length) {
                throw new NotFoundException('No orders found for this user');
            }

            const products = await this.productModel.findAll();

            const ordersWithProducts = orders.map((order) => {
                const product = products.find((p) => p.id === order.productId);

                if (!product) {
                    throw new NotFoundException(`Product not found for productId: ${order.productId}`);
                }

                // Combine order and product details
                return {
                    ...order.toJSON(), // Convert Sequelize instance to plain object
                    product,
                };
            });
            return {
                success: true,
                orders: ordersWithProducts,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException('Unable to retrieve orders');
        }
    }


    async getAllOrdersForSeller(sellerId: number) {
        try {
            const orders = await this.orderModel.findAll({
                where: { sellerId },
            });

            const ordersWithBuyerDetails = await Promise.all(
            orders.map(async (order) => {
                const user = await this.userModel.findOne({
                    where: { id: order.userId },
                    attributes: ['id', 'name', 'email', 'phone'], // Select only the required fields
                });

                return {
                    ...order.toJSON(),
                    user: user ? user.toJSON() : null, // Include buyer details or null if not found
                };
            })
        );

            return ordersWithBuyerDetails;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new InternalServerErrorException('Failed to fetch orders');
        }
    }

    async getSingleOrder(orderId: string) {
        try {
            const order = await this.orderModel.findByPk(orderId); 

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            return order;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw new InternalServerErrorException('Failed to fetch order');
        }
    }

    async updateOrderStatus(orderId: string) {
        try {
            const order = await this.orderModel.findByPk(orderId);
            if (!order) {
                throw new NotFoundException('Order not found');
            }
            
            if (order.status === "Delivered") {
                throw new BadRequestException('Order has already been delivered. No further changes can be made.');
            }

            const statusFlow = ['Processing', 'Shipped', 'Delivered'];
            const currentIndex = statusFlow.indexOf(order.status);

            const nextStatus =
                currentIndex === -1 || currentIndex === statusFlow.length - 1
                    ? statusFlow[0]
                    : statusFlow[currentIndex + 1];

            order.status = nextStatus as 'Processing' | 'Shipped' | 'Delivered';
            await order.save();

            return {
                success: true,
                message: `Order status updated to ${nextStatus}`,
                order,
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Failed to process order');
        }
    }

    async createPaymentIntent(amount: number): Promise<{ clientSecret: string }> {
      if (!amount) {
        throw new Error('Please enter an amount');
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'inr',
      });

      return { clientSecret: paymentIntent.client_secret };
    }

    async deleteOrder(orderId: string) {
        try {
            const order = await this.orderModel.findByPk(orderId);

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            await this.orderModel.destroy({
                where: { id: orderId },
            });

            return {
                success: true,
                message: 'Order deleted',
            };
        } catch (error) {
            throw new Error('Failed to delete order');
        }
    }
}
