import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./schema/product.schema";

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product
  ) { }

  async createProduct(productData: any): Promise<Product> {
    try {
      return await this.productModel.create(productData);
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getAllProducts(sellerId: number): Promise<Product[]> {
    try {
      const products = await Product.findAll({
        where: { sellerId },
      });

      return products;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      const product = await Product.findByPk(productId); // Find product by primary key (id)
      return product;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  async updateProduct(
    productId: string,
    updates: Partial<Product>,
  ): Promise<Product> {
    try {
      const product = await this.getProductById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      Object.assign(product, updates); // Apply updates
      await product.save();

      return product;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProductById(productId: string): Promise<void> {
    try {
      const product = await this.getProductById(productId);
      if (product) {
        await product.destroy();
      }
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}
