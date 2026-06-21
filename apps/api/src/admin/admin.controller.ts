import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole, VerificationStatus } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@ApiTags("Admin")
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
  }

  @Get("users")
  users() {
    return this.service.users();
  }

  @Get("lawyer-verifications")
  lawyerVerifications() {
    return this.service.lawyerVerifications();
  }

  @Patch("lawyers/:id/verification")
  updateVerification(
    @Param("id") id: string,
    @Body() body: { status: VerificationStatus },
  ) {
    return this.service.updateVerification(id, body.status);
  }
}
