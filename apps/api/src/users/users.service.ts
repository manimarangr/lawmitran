import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  profile(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profilePhoto: true,
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

  updateProfile(
    id: string,
    data: { name?: string; phone?: string; profilePhoto?: string },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profilePhoto: true,
      },
    });
  }
}
