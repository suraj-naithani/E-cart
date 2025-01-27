import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from '../order/schema/order.schema';
import { Product } from '../seller/schema/product.schema';
import { User } from '../users/schema/user.schema';
import { Cart } from '../cart/schema/cart.schema';

@Module({
  imports: [SequelizeModule.forFeature([Order, Product, User, Cart])],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
