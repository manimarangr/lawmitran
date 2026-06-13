import { Injectable } from '@nestjs/common';
import { VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [users, lawyers, consultations, reviews, pendingLawyers] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.lawyer.count(),
      this.prisma.consultation.count(),
      this.prisma.review.count(),
      this.prisma.lawyer.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
    ]);
    return { users, lawyers, consultations, reviews, pendingLawyers };
  }

  users() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  lawyerVerifications() {
    return this.prisma.lawyer.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        practiceAreas: true,
        certificates: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateVerification(id: string, verificationStatus: VerificationStatus) {
    return this.prisma.lawyer.update({ where: { id }, data: { verificationStatus } });
  }
}
