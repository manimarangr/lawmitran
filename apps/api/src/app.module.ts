import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { ConsultationsModule } from "./consultations/consultations.module";
import { DocumentsModule } from "./documents/documents.module";
import { HealthModule } from "./health/health.module";
import { LawyersModule } from "./lawyers/lawyers.module";
import { PracticeAreasModule } from "./practice-areas/practice-areas.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LawyersModule,
    PracticeAreasModule,
    ConsultationsModule,
    ReviewsModule,
    DocumentsModule,
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
