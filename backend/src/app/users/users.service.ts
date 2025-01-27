import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "./schema/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    const { email, phone, name, address, password } = updateData;

    const existingEmail = await this.userModel.findOne({
      where: { email, id: { [Op.ne]: userId } },
    });

    if (existingEmail) {
      throw new BadRequestException("Email already exists");
    }

    // Check if phone number already exists (excluding the current user's ID)
    const existingPhone = await this.userModel.findOne({
      where: { phone, id: { [Op.ne]: userId } },
    });

    if (existingPhone) {
      throw new BadRequestException("Phone number already exists");
    }

    const updates = {
      name,
      email,
      phone,
      address,
      password,
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    Object.keys(updates).forEach((key) => {
      if (!updates[key]) delete updates[key];
    });

    // Fetch the user by ID and update
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    Object.assign(user, updates); // Update the user object

    await user.save(); // Save changes to the database

    return user;
  }
}
