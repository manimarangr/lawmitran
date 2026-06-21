import { Injectable } from "@nestjs/common";
import { Prisma, VerificationStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLawyerProfileDto } from "./dto/create-lawyer-profile.dto";
import { LawyerSearchDto } from "./dto/lawyer-search.dto";

const lawyerInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profilePhoto: true,
    },
  },
  practiceAreas: true,
  educations: true,
  experiences: true,
  availability: true,
  reviews: {
    where: { approved: true },
    include: { customer: { select: { name: true } } },
  },
} satisfies Prisma.LawyerInclude;

@Injectable()
export class LawyersService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: LawyerSearchDto) {
    const where: Prisma.LawyerWhereInput = {
      verificationStatus: VerificationStatus.VERIFIED,
      ...(query.city
        ? { city: { contains: query.city, mode: "insensitive" } }
        : {}),
      ...(query.language ? { languages: { has: query.language } } : {}),
      ...(query.experience ? { experience: { gte: query.experience } } : {}),
      ...(query.practiceArea
        ? {
            practiceAreas: {
              some: {
                name: { contains: query.practiceArea, mode: "insensitive" },
              },
            },
          }
        : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.lawyer.findMany({
        where,
        include: lawyerInclude,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: [{ experience: "desc" }, { createdAt: "desc" }],
      }),
      this.prisma.lawyer.count({ where }),
    ]);

    return {
      items: items.map(this.withRating),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async featured() {
    const lawyers = await this.prisma.lawyer.findMany({
      where: { verificationStatus: VerificationStatus.VERIFIED },
      include: lawyerInclude,
      take: 6,
      orderBy: [{ experience: "desc" }],
    });
    return lawyers.map(this.withRating);
  }

  async profile(id: string) {
    const lawyer = await this.prisma.lawyer.findUniqueOrThrow({
      where: { id },
      include: lawyerInclude,
    });
    return this.withRating(lawyer);
  }

  async createOrUpdateProfile(userId: string, dto: CreateLawyerProfileDto) {
    return this.prisma.lawyer.upsert({
      where: { userId },
      update: {
        barCouncilNumber: dto.barCouncilNumber,
        experience: dto.experience,
        consultationFee: dto.consultationFee,
        city: dto.city,
        bio: dto.bio,
        languages: dto.languages,
        practiceAreas: {
          set: [],
          connect: dto.practiceAreas.map((name) => ({ name })),
        },
        educations: { deleteMany: {}, create: dto.educations ?? [] },
        experiences: { deleteMany: {}, create: dto.experiences ?? [] },
      },
      create: {
        userId,
        barCouncilNumber: dto.barCouncilNumber,
        experience: dto.experience,
        consultationFee: dto.consultationFee,
        city: dto.city,
        bio: dto.bio,
        languages: dto.languages,
        practiceAreas: { connect: dto.practiceAreas.map((name) => ({ name })) },
        educations: { create: dto.educations ?? [] },
        experiences: { create: dto.experiences ?? [] },
      },
      include: lawyerInclude,
    });
  }

  async updateAvailability(
    userId: string,
    availability: { dayOfWeek: number; startTime: string; endTime: string }[],
  ) {
    const lawyer = await this.prisma.lawyer.findUniqueOrThrow({
      where: { userId },
    });
    await this.prisma.availability.deleteMany({
      where: { lawyerId: lawyer.id },
    });
    return this.prisma.availability.createManyAndReturn({
      data: availability.map((slot) => ({ ...slot, lawyerId: lawyer.id })),
    });
  }

  private withRating<T extends { reviews: { rating: number }[] }>(lawyer: T) {
    const count = lawyer.reviews.length;
    const rating = count
      ? lawyer.reviews.reduce((sum, review) => sum + review.rating, 0) / count
      : 0;
    return { ...lawyer, rating: Number(rating.toFixed(1)), reviewCount: count };
  }
}
