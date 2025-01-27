import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getAllProducts(@Res() res) {
        try {
            const products = await this.productService.getAllProducts();
            return res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error in fetching products',
            });
        }
    }

    @Get('search')
    async searchProduct(@Query('product') product: string, @Res() res) {
        try {
            if (!product || product.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Product name is required for search",
                });
            }
            const products = await this.productService.searchProducts(product);

            if (!products.length) {
                return res.status(404).json({
                    success: false,
                    message: "No products found for the given search term",
                });
            }

            return res.status(200).json({ success: true, products });
        } catch (error) {
            console.error('Error in search API', error);
            return res.status(500).json({ success: false, message: "Error in search API" });
        }
    }


    @Get(':id')
    async getProduct(@Param('id') id: string, @Res() res) {
        try {
            const product = await this.productService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            return res.status(200).json({
                success: true,
                product,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error in fetching product',
            });
        }
    }
}
