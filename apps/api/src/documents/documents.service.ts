import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  mine(userId: string) {
    return this.prisma.document.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  create(userId: string, data: { documentName: string; documentUrl: string; mimeType?: string; lawyerId?: string }) {
    return this.prisma.document.create({ data: { userId, ...data } });
  }
}
