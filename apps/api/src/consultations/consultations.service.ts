import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConsultationStatus, PaymentStatus, UserRole } from '@prisma/client';
import { AuthUser } from '../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(customerId: string, dto: CreateConsultationDto) {
    return this.prisma.consultation.create({
      data: {
        customerId,
        lawyerId: dto.lawyerId,
        consultationDate: dto.consultationDate,
        notes: dto.notes,
        documentUrls: dto.documentUrls ?? [],
      },
      include: this.include(),
    });
  }

  async mine(user: AuthUser) {
    if (user.role === UserRole.LAWYER) {
      const lawyer = await this.prisma.lawyer.findUniqueOrThrow({ where: { userId: user.id } });
      return this.prisma.consultation.findMany({
        where: { lawyerId: lawyer.id },
        include: this.include(),
        orderBy: { consultationDate: 'desc' },
      });
    }
    if (user.role === UserRole.ADMIN) {
      return this.prisma.consultation.findMany({ include: this.include(), orderBy: { consultationDate: 'desc' } });
    }
    return this.prisma.consultation.findMany({
      where: { customerId: user.id },
      include: this.include(),
      orderBy: { consultationDate: 'desc' },
    });
  }

  async updateStatus(user: AuthUser, id: string, status: ConsultationStatus) {
    const consultation = await this.prisma.consultation.findUniqueOrThrow({
      where: { id },
      include: { lawyer: true },
    });
    const ownsConsultation =
      consultation.customerId === user.id || consultation.lawyer.userId === user.id || user.role === UserRole.ADMIN;
    if (!ownsConsultation) {
      throw new ForbiddenException('You cannot update this consultation');
    }
    return this.prisma.consultation.update({ where: { id }, data: { status }, include: this.include() });
  }

  updatePayment(id: string, paymentStatus: PaymentStatus) {
    return this.prisma.consultation.update({ where: { id }, data: { paymentStatus }, include: this.include() });
  }

  private include() {
    return {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      lawyer: { include: { user: { select: { id: true, name: true, email: true, profilePhoto: true } } } },
    };
  }
}
