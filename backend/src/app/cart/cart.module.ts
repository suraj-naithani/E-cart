import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './schema/cart.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../seller/schema/product.schema';

@Module({
  imports: [
    SequelizeModule.forFeature([Cart, Product])
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule { }
