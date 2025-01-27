import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './schema/cart.schema';
import { Product } from '../seller/schema/product.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart) private readonly cartModel: typeof Cart,
        @InjectModel(Product) private readonly productModel: typeof Product,
    ) { }

    async addToCart(userId: number, productId: number, quantity: number): Promise<Cart> {
        const product = await this.productModel.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} does not exist.`);
        }

        let cart = await this.cartModel.findOne({ where: { userId } });

        if (!cart) {
            cart = await this.cartModel.create({
                userId,
                items: [{ productId, quantity }],
            });
        } else {
            const existingItemIndex = cart.items.findIndex(
                item => item.productId === productId
            );

            let updatedItems = [...cart.items];

            if (existingItemIndex !== -1) {
                updatedItems[existingItemIndex].quantity += quantity;
            } else {
                updatedItems.push({ productId, quantity });
            }

            await this.cartModel.update(
                { items: updatedItems },
                { where: { userId } }
            );

            cart = await this.cartModel.findOne({ where: { userId } });
        }

        return cart;
    }

    async getCart(userId: number): Promise<Cart | null> {
        const cart = await this.cartModel.findOne({
            where: { userId },
        });

        if (!cart) {
            return null;
        }

        return cart;
    }

    async decreaseQuantity(userId: number, productId: number): Promise<Cart> {
        const cart = await this.cartModel.findOne({ where: { userId } });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId === productId
        );

        if (itemIndex === -1) {
            throw new NotFoundException('Product not found in cart');
        }

        let updatedItems = [...cart.items];
        if (updatedItems[itemIndex].quantity === 1) {
            updatedItems = updatedItems.filter(item => item.productId !== productId);
        } else {
            updatedItems[itemIndex].quantity -= 1;
        }

        await this.cartModel.update(
            { items: updatedItems },
            { where: { userId } }
        );

        return await this.cartModel.findOne({ where: { userId } });
    }

    async removeFromCart(userId: number, productId: number): Promise<Cart> {
        const cart = await this.cartModel.findOne({ where: { userId } });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId === productId
        );

        if (itemIndex === -1) {
            throw new NotFoundException('Product not found in cart');
        }

        const updatedItems = [...cart.items];
        updatedItems.splice(itemIndex, 1);

        await this.cartModel.update(
            { items: updatedItems },
            { where: { userId } }
        );

        return await this.cartModel.findOne({ where: { userId } });
    }
}
