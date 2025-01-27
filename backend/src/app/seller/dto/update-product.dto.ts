import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsIn,
    Min,
} from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    originalPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountPercentage?: number;

    @IsOptional()
    @IsString()
    @IsIn(['Electronics', 'Clothing', 'Books', 'Home Appliances', 'Sports', 'Other'])
    category?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    shippingFee?: number;
}
