import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) {
      throw new ConflictException("Email is already registered");
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        role: dto.role ?? UserRole.CUSTOMER,
        password: await bcrypt.hash(dto.password, 12),
      },
      select: this.safeUserSelect(),
    });

    return { user, accessToken: await this.sign(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const safeUser = await this.me(user.id);
    return { user: safeUser, accessToken: await this.sign(user) };
  }

  async me(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        ...this.safeUserSelect(),
        lawyer: {
          include: {
            practiceAreas: true,
            educations: true,
            experiences: true,
            availability: true,
          },
        },
      },
    });
  }

  private async sign(user: {
    id: string;
    email: string;
    role: UserRole;
    status: string;
  }) {
    return this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  }

  private safeUserSelect() {
    return {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      profilePhoto: true,
      createdAt: true,
    };
  }
}
