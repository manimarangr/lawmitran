import { Module } from "@nestjs/common";
import { PracticeAreasController } from "./practice-areas.controller";
import { PracticeAreasService } from "./practice-areas.service";

@Module({
  controllers: [PracticeAreasController],
  providers: [PracticeAreasService],
})
export class PracticeAreasModule {}
