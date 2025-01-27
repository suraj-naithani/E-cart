import { Module } from "@nestjs/common";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./schema/product.schema";
import { CloudinaryService } from "src/services/cloudinary.service";

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
  ],
  controllers: [SellerController],
  providers: [SellerService, CloudinaryService],
})
export class SellerModule { }