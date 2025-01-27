import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../seller/schema/product.schema';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
    async getAllProducts(): Promise<Product[]> {
        try {
            return await Product.findAll(); // Use Sequelize's `findAll` to fetch all products
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    async getProductById(productId: string): Promise<Product> {
        try {
            const product = await Product.findByPk(productId); // Sequelize's `findByPk` to find by primary key

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            product.hitCount += 1;
            await product.save();

            return product;
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    async searchProducts(product: string) {
        try {
            const foundProducts = await Product.findAll({
                where: {
                    name: {
                        [Op.like]: `%${product}%`,
                    },
                },
            });

            return foundProducts;
        } catch (error) {
            throw new Error(`Error searching products: ${error.message}`);
        }
    }
}
