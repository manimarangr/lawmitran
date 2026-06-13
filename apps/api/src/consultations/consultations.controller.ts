import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConsultationStatus, PaymentStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/types/auth-user';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly service: ConsultationsService) {}

  @Roles(UserRole.CUSTOMER)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateConsultationDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  mine(@CurrentUser() user: AuthUser) {
    return this.service.mine(user);
  }

  @Patch(':id/status')
  updateStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: { status: ConsultationStatus }) {
    return this.service.updateStatus(user, id, body.status);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/payment')
  updatePayment(@Param('id') id: string, @Body() body: { paymentStatus: PaymentStatus }) {
    return this.service.updatePayment(id, body.paymentStatus);
  }
}
