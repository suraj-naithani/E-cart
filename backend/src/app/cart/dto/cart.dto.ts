import { IsArray, IsInt, IsNotEmpty, IsObject, Min } from 'class-validator';

export class CartItemDto {
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateCartDto {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsArray()
    @IsNotEmpty()
    items: CartItemDto[];
}

export class AddToCartDto {
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}
