import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  forLawyer(lawyerId: string) {
    return this.prisma.review.findMany({
      where: { lawyerId, approved: true },
      include: { customer: { select: { name: true, profilePhoto: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  create(customerId: string, dto: CreateReviewDto) {
    return this.prisma.review.upsert({
      where: { customerId_lawyerId: { customerId, lawyerId: dto.lawyerId } },
      update: { rating: dto.rating, comment: dto.comment, approved: true },
      create: {
        customerId,
        lawyerId: dto.lawyerId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  moderate(id: string, approved: boolean) {
    return this.prisma.review.update({ where: { id }, data: { approved } });
  }
}
