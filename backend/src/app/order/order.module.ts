import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './schema/order.schema';
import { Product } from '../seller/schema/product.schema';
import { User } from '../users/schema/user.schema';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, Product, User])
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule { }
