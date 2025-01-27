import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    Post,
    Req,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/services/cloudinary.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateProductDto } from "./dto/product.dto";
import { SellerGuard } from "./seller.guard";
import { SellerService } from "./seller.service";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("seller")
export class SellerController {
    constructor(
        private readonly sellerService: SellerService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post("create-product")
    @UseGuards(JwtAuthGuard, SellerGuard)
    @UseInterceptors(FilesInterceptor("image"))
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res,
        @Req() req
    ) {
        try {
            const userId = req.user.userId;

            if (!files || files.length === 0) {
                throw new BadRequestException("Please upload at least one image");
            }

            const uploadedImages =
                await this.cloudinaryService.uploadFileToCloudinary(files);

            const image = uploadedImages.map(img => ({
                public_id: img.public_id,
                url: img.url,
            }));

            const newProduct = await this.sellerService.createProduct({
                sellerId: userId,
                ...createProductDto,
                image,
            });

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                product: newProduct,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to create product",
                error: error.message,
            });
        }
    }


    @Get('products')
    @UseGuards(JwtAuthGuard, SellerGuard)
    async getAllProducts(@Req() req, @Res() res) {
        try {
            const sellerId = req.user.userId; // Extract seller ID from authenticated user

            const allProducts = await this.sellerService.getAllProducts(sellerId);

            return res.status(200).json({
                success: true,
                message: 'All products',
                allProducts,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch products',
                error: error.message,
            });
        }
    }

    @Get('product/:id')
    @UseGuards(JwtAuthGuard, SellerGuard)
    async getProductById(@Param('id') id: string, @Res() res) {
        try {
            const product = await this.sellerService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Product details',
                product,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch product',
                error: error.message,
            });
        }
    }

    @Put('update-product/:id')
    @UseGuards(JwtAuthGuard, SellerGuard)
    @UseInterceptors(FilesInterceptor('image'))
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req,
        @Res() res,
    ) {
        try {
            const userId = req.user.userId;
            const product = await this.sellerService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            // if (product.sellerId !== userId) {
            //     return res.status(403).json({
            //         success: false,
            //         message: 'Unauthorized to update this product',
            //     });
            // }

            if (
                updateProductDto.price < 0 ||
                updateProductDto.originalPrice < 0 ||
                updateProductDto.discountPercentage < 0 ||
                updateProductDto.shippingFee < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Price, original price, discount percentage, and shipping fee must not be negative',
                });
            }

            let image = product.image;
           
            if (files && files.length > 0) {
                // Delete existing images
                if (Array.isArray(product.image)) {
                    await Promise.all(
                        product.image.map(img =>
                            this.cloudinaryService.deleteFileFromCloudinary(img.public_id)
                        )
                    );
                }

                const uploadedImages = await this.cloudinaryService.uploadFileToCloudinary(files);
                image = uploadedImages.map(img => ({
                    public_id: img.public_id,
                    url: img.url,
                }));
            }

            const updatedProduct = await this.sellerService.updateProduct(id, {
                ...updateProductDto,
                image,
            });

            return res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update product',
                error: error.message,
            });
        }
    }

    @Delete('delete-product/:id')
    @UseGuards(JwtAuthGuard, SellerGuard)
    async deleteProduct(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            const userId = req.user.userId; // Authenticated user's ID

            const product = await this.sellerService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            // if (product.sellerId !== userId) {
            //     return res.status(403).json({
            //         success: false,
            //         message: 'Unauthorized to delete this product',
            //     });
            // }

            // Delete images from Cloudinary
            await Promise.all(
                product.image.map(img =>
                    this.cloudinaryService.deleteFileFromCloudinary(img.public_id)
                )
            );

            // Delete product from database
            await this.sellerService.deleteProductById(id);

            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete product',
                error: error.message,
            });
        }
    }
}
