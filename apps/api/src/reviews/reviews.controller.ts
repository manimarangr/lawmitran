import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AuthUser } from "../common/types/auth-user";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewsService } from "./reviews.service";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Public()
  @Get("lawyer/:lawyerId")
  forLawyer(@Param("lawyerId") lawyerId: string) {
    return this.service.forLawyer(lawyerId);
  }

  @ApiBearerAuth()
  @Roles(UserRole.CUSTOMER)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReviewDto) {
    return this.service.create(user.id, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Patch(":id/moderate")
  moderate(@Param("id") id: string, @Body() body: { approved: boolean }) {
    return this.service.moderate(id, body.approved);
  }
}
