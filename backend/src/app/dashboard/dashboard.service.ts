import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { Order } from '../order/schema/order.schema';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../seller/schema/product.schema';
import { User } from '../users/schema/user.schema';
import { Cart } from '../cart/schema/cart.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Order) private readonly orderModel: typeof Order,
        @InjectModel(Product) private readonly productModel: typeof Product,
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Cart) private readonly cartModel: typeof Cart,
        private readonly sequelize: Sequelize
    ) { }

    async getSellerDashboardStats(sellerId: number) {
        try {
            const todayStart = moment().startOf('day').toDate();
            const todayEnd = moment().endOf('day').toDate();

            const lastSixDays = Array.from({ length: 7 }).map((_, i) =>
                moment().subtract(6 - i, 'days').startOf('day').toDate()
            );

            const last12Months = Array.from({ length: 12 }).map((_, i) =>
                moment().subtract(11 - i, 'months').startOf('month').toDate()
            );

            const [
                totalOrder,
                todayOrder,
                totalEarnings,
                todayEarnings,
                weeklyEarning,
                monthlyEarnings,
            ] = await Promise.all([
                this.orderModel.count({
                    where: {
                        sellerId: sellerId,
                        status: 'Delivered',
                    },
                }),

                this.orderModel.count({
                    where: {
                        sellerId: sellerId,
                        status: 'Delivered',
                        createdAt: { [Op.between]: [todayStart, todayEnd] },
                    },
                }),

                this.orderModel.findAll<Order>({
                    attributes: [[this.orderModel.sequelize.fn('SUM', this.orderModel.sequelize.col('total')), 'earning']],
                    where: { sellerId: sellerId, status: 'Delivered' },
                    raw: true,
                }),

                this.orderModel.findAll<Order>({
                    attributes: [[this.orderModel.sequelize.fn('SUM', this.orderModel.sequelize.col('total')), 'earning']],
                    where: {
                        sellerId: sellerId,
                        status: 'Delivered',
                        createdAt: { [Op.between]: [todayStart, todayEnd] },
                    },
                    raw: true,
                }),

                this.orderModel.findAll({
                    attributes: [
                        [this.sequelize.fn('SUM', this.sequelize.col('total')), 'total'],
                        [this.sequelize.literal(`EXTRACT(DAY FROM "createdAt")`), 'day'],
                        [this.sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), 'month'],
                        [this.sequelize.literal(`EXTRACT(YEAR FROM "createdAt")`), 'year'],
                    ],
                    where: {
                        sellerId: sellerId,
                        status: 'Delivered',
                        createdAt: {
                            [Op.gte]: moment().subtract(6, 'days').startOf('day').toDate(),
                        },
                    },
                    group: ['year', 'month', 'day'],
                    raw: true,
                }),

                this.orderModel.findAll({
                    attributes: [
                        [this.sequelize.fn('SUM', this.sequelize.col('total')), 'total'],
                        [this.sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), 'month'],
                        [this.sequelize.literal(`EXTRACT(YEAR FROM "createdAt")`), 'year'],
                    ],
                    where: {
                        sellerId: sellerId,
                        status: 'Delivered',
                        createdAt: {
                            [Op.gte]: moment().subtract(11, 'months').startOf('month').toDate(),
                        },
                    },
                    group: ['year', 'month'],
                    raw: true,
                }),
            ]);

            const weeklyEarningsArray = Array.from({ length: 7 }).map((_, i) => {
                const date = moment().subtract(6 - i, 'days').startOf('day'); // Ensure alignment with current day at last index
                const earning = weeklyEarning.find(
                    (e: any) =>
                        parseInt(e.year, 10) === date.year() &&
                        parseInt(e.month, 10) === date.month() + 1 &&
                        parseInt(e.day, 10) === date.date(),
                );
                return earning ? (typeof earning.total === 'number' ? earning.total : parseFloat(earning.total)) : 0;
            });

            const monthlyEarningsArray = Array.from({ length: 12 }).map((_, i) => {
                const date = moment().subtract(11 - i, 'months').startOf('month'); // Aligns current month at the last index
                const earning = monthlyEarnings.find(
                    (e: any) =>
                        parseInt(e.year, 10) === date.year() &&
                        parseInt(e.month, 10) === date.month() + 1,
                );
                return earning ? (typeof earning.total === 'number' ? earning.total : parseFloat(earning.total)) : 0;
            });

            const stats = {
                totalOrder,
                todayOrder,
                totalEarning: totalEarnings[0],
                todayEarning: todayEarnings[0],
                weeklyDayEarnings: weeklyEarningsArray,
                monthlyEarnings: monthlyEarningsArray,
            };

            return stats;
        } catch (error) {
            throw new Error('Error in getting seller dashboard stats');
        }
    }
    
    async getAdminDashboardStats() {
        const lastSixDays = Array.from({ length: 7 }).map((_, i) =>
            moment()
                .subtract(6 - i, "days")
                .startOf("day")
                .toDate()
        );

        const last12Months = Array.from({ length: 12 }).map((_, i) =>
            moment()
                .subtract(11 - i, "months")
                .startOf("month")
        );

        const [
            totalProduct,
            totalUser,
            totalSeller,
            totalEarnings,
            weeklyEarning,
            monthlyEarnings,
            products,
            allOrder,
            categories,
            users
            // abandonedProducts,
        ] = await Promise.all([
            this.productModel.count(),

            this.userModel.count({ where: { role: "Buyer" } }),

            this.userModel.count({ where: { role: "Seller" } }),

            this.orderModel.findAll({
                attributes: [[this.sequelize.fn('SUM', this.sequelize.col('total')), 'earning']],
                where: { status: 'Delivered' },
                raw: true,
            }),

            this.orderModel.findAll({
                attributes: [
                    [this.sequelize.fn('SUM', this.sequelize.col('total')), 'total'],
                    [this.sequelize.literal(`EXTRACT(DAY FROM "createdAt")`), 'day'],
                    [this.sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), 'month'],
                    [this.sequelize.literal(`EXTRACT(YEAR FROM "createdAt")`), 'year'],
                ],
                where: {
                    status: 'Delivered',
                    createdAt: {
                        [Op.gte]: moment().subtract(6, 'days').startOf('day').toDate(),
                    },
                },
                group: ['year', 'month', 'day'],
                raw: true,
            }),

            this.orderModel.findAll({
                attributes: [
                    [this.sequelize.fn('SUM', this.sequelize.col('total')), 'total'],
                    [this.sequelize.literal(`EXTRACT(MONTH FROM "createdAt")`), 'month'],
                    [this.sequelize.literal(`EXTRACT(YEAR FROM "createdAt")`), 'year'],
                ],
                where: {
                    status: 'Delivered',
                    createdAt: {
                        [Op.gte]: moment().subtract(11, 'months').startOf('month').toDate(),
                    },
                },
                group: ['year', 'month'],
                raw: true,
            }),

            this.productModel.findAll(),

            this.orderModel.findAll(),

            this.productModel.findAll({ attributes: ['category'], group: 'category' }),

            this.userModel.findAll({ raw: true }),

            // this.cartModel.findAll({
            //     where: {
            //         createdAt: { [Op.lt]: moment().subtract(1, 'month').toDate() },
            //     },
            //     include: [{
            //         model: Product,
            //         as: 'productDetails', 
            //         attributes: ['name']
            //     }],
            // }),
        ]);

        const weeklyEarningsArray = Array.from({ length: 7 }).map((_, i) => {
            const date = moment().subtract(6 - i, 'days').startOf('day'); // Ensure alignment with current day at last index
            const earning = weeklyEarning.find(
                (e: any) =>
                    parseInt(e.year, 10) === date.year() &&
                    parseInt(e.month, 10) === date.month() + 1 &&
                    parseInt(e.day, 10) === date.date(),
            );
            return earning ? (typeof earning.total === 'number' ? earning.total : parseFloat(earning.total)) : 0;
        });

        const monthlyEarningsArray = Array.from({ length: 12 }).map((_, i) => {
            const date = moment().subtract(11 - i, 'months').startOf('month'); // Aligns current month at the last index
            const earning = monthlyEarnings.find(
                (e: any) =>
                    parseInt(e.year, 10) === date.year() &&
                    parseInt(e.month, 10) === date.month() + 1,
            );
            return earning ? (typeof earning.total === 'number' ? earning.total : parseFloat(earning.total)) : 0;
        });


        const orderCounts = allOrder.reduce((acc, order) => {
            const productId = order.productId.toString();
            acc[productId] = (acc[productId] || 0) + 1;
            return acc;
        }, {});

        const productsWithStats = products.map((product) => {
            const hitCount = product.hitCount || 0;
            const orderCount = orderCounts[product.id.toString()] || 0;
            const conversionRate = hitCount > 0 ? (orderCount / hitCount) * 100 : 0;

            return {
                ...product.toJSON(),
                hitCount,
                orderCount,
                conversionRate: conversionRate.toFixed(2),
            };
        });

        const sellers = await this.userModel.findAll({
            where: { role: "Seller" },
            raw: true,
        });

        const productsWithStatsAndSellerData = productsWithStats.map((product) => {
            const sellerData = sellers.find((seller) => seller.id === product.sellerId);
            return {
                ...product, // Preserve existing product stats and fields
                seller: sellerData || null, // Add seller data while keeping the sellerId intact
            };
        });

    const ordersWithDetails = allOrder.map((order) => {
        const user = users.find((user) => user.id === order.userId && user.role === "Buyer");
        const seller = users.find((user) => user.id === order.sellerId && user.role === "Seller");
        return {
            ...order.toJSON(),
            user: user || null, // Add buyer details if found
            seller: seller || null, // Add seller details if found
        };
    });


        return {
            totalProduct,
            totalUser,
            totalSeller,
            totalEarnings: totalEarnings[0],
            weeklyDayEarnings: weeklyEarningsArray,
            monthlyEarnings: monthlyEarningsArray,
            products: productsWithStatsAndSellerData,
            allOrder:ordersWithDetails,
            categories,
            // abandonedProducts,
        };
    }
}
