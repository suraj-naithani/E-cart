import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  BadRequestException,
  NotFoundException,
  Body,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("profile")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard) // Protect the route using JwtAuthGuard
  async getMyProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await this.usersService.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in getting user profile",
        error: error.message,
      });
    }
  }

  @Put("update-profile")
  @UseGuards(JwtAuthGuard) // JWT Authentication Guard
  async updateProfile(
    @Req() req: Request,
    @Body() updateData: any,
    @Res() res: Response
  ) {
    try {
      const userId = (req as any).user.userId; // Extract userId from JWT
      const updatedUser = await this.usersService.updateProfile(
        userId,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error in updateProfile:", error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        return res.status(error.getStatus()).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error updating profile",
      });
    }
  }
}
