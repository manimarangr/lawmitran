import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuthUser } from "../common/types/auth-user";
import { DocumentsService } from "./documents.service";

@ApiTags("Documents")
@ApiBearerAuth()
@Controller("documents")
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get()
  mine(@CurrentUser() user: AuthUser) {
    return this.service.mine(user.id);
  }

  @Post()
  createMetadata(
    @CurrentUser() user: AuthUser,
    @Body()
    body: {
      documentName: string;
      documentUrl: string;
      mimeType?: string;
      lawyerId?: string;
    },
  ) {
    return this.service.create(user.id, body);
  }
}
