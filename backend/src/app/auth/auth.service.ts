import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../users/schema/user.schema";
import { CreateUserDto } from "./dto/sign-up.dto";
import * as bcrypt from "bcrypt";
import { Op } from "sequelize";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // Find user by email or phone
  async findByEmailOrPhone(email: string, phone: number): Promise<User | null> {
    return this.userModel.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });
  }

  // Create new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10; // Define the number of salt rounds
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds
    ); // Hash the password

    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: [
        "id",
        "name",
        "email",
        "password",
        "phone",
        "address",
        "role",
      ],
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
      include: ["role"],
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }
    return user;
  }

  async generateToken(user: User) {
    const payload = { userId: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }
}
