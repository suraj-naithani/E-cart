import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  discountPercentage: number;

  @IsString()
  @IsEnum(['Electronics', 'Clothing', 'Books', 'Home Appliances', 'Sports', 'Other'])
  category: string;

  @IsNumber()
  @Min(0)
  stock?: number;

  @IsNumber()
  @Min(0)
  shippingFee: number;
}
