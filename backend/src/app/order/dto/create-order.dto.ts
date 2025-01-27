import { IsEnum, IsOptional } from "class-validator";

export class CreateProductDto {
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        country: string;
        pinCode: number;
    };

    userId: number;

    shippingCharges: number;

    discount: number;

    total: number;

    @IsOptional()
    @IsEnum(['Processing', 'Shipped', 'Delivered'])
    status?: 'Processing' | 'Shipped' | 'Delivered'; // Optional, defaults to 'Processing'

    orderItem: {
        name: string;
        photo: string;
        price: number;
        quantity: number;
    };

    productId: number;

    sellerId: number;
}
