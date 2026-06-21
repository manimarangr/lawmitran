import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { PracticeAreasService } from "./practice-areas.service";

@ApiTags("Practice Areas")
@Public()
@Controller("practice-areas")
export class PracticeAreasController {
  constructor(private readonly service: PracticeAreasService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
