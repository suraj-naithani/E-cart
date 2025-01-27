import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() signupData: CreateUserDto) {
    try {
      const { email, phone, password } = signupData;

      const existingUser = await this.authService.findByEmailOrPhone(
        email,
        phone
      );
      if (existingUser) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }

      if (!password) {
        throw new HttpException("Password is required", HttpStatus.BAD_REQUEST);
      }

      const newUser = await this.authService.createUser(signupData);

      const token = await this.authService.generateToken(newUser);

      return {
        success: true,
        message: "User created successfully",
        user: { ...newUser.toJSON() },
        token,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: "Sign Up failed",
          error: error.message || "Internal Server Error",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("signin")
  async signin(@Body() signInData: SignInDto) {
    try {
      const { email, password } = signInData;

      // Find the user by email
      const user = await this.authService.findByEmail(email);

      if (!user) {
        throw new HttpException(
          "Invalid username or password",
          HttpStatus.NOT_FOUND
        );
      }

      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
      }

      const token = await this.authService.generateToken(user);

      // Return success response
      return {
        success: true,
        message: `${user.name} logged in successfully`,
        user,
        token,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: "Error in sign-in API",
          error: error.message || "Internal Server Error",
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
