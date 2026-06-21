import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PracticeAreasService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.practiceArea.findMany({ orderBy: { name: "asc" } });
  }
}
