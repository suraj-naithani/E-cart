import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './schema/review.schema';
import { Order } from '../order/schema/order.schema';
import { User } from '../users/schema/user.schema';
import { Product } from '../seller/schema/product.schema';

@Module({
  imports: [SequelizeModule.forFeature([Review, Order, User, Product])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule { }
