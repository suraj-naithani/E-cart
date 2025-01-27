import { IsString, IsEmail, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsString()
  @IsNotEmpty()
  address: string;
  
  @IsEnum(['Admin', 'Seller', 'Buyer'])
  role: string;
}
