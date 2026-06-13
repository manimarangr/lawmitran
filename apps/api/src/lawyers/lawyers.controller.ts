import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/types/auth-user';
import { CreateLawyerProfileDto } from './dto/create-lawyer-profile.dto';
import { LawyerSearchDto } from './dto/lawyer-search.dto';
import { LawyersService } from './lawyers.service';

@ApiTags('Lawyers')
@Controller('lawyers')
export class LawyersController {
  constructor(private readonly service: LawyersService) {}

  @Public()
  @Get()
  search(@Query() query: LawyerSearchDto) {
    return this.service.search(query);
  }

  @Public()
  @Get('featured')
  featured() {
    return this.service.featured();
  }

  @Public()
  @Get(':id')
  profile(@Param('id') id: string) {
    return this.service.profile(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.LAWYER)
  @Post('profile')
  createProfile(@CurrentUser() user: AuthUser, @Body() dto: CreateLawyerProfileDto) {
    return this.service.createOrUpdateProfile(user.id, dto);
  }

  @ApiBearerAuth()
  @Roles(UserRole.LAWYER)
  @Patch('availability')
  updateAvailability(
    @CurrentUser() user: AuthUser,
    @Body() availability: { dayOfWeek: number; startTime: string; endTime: string }[],
  ) {
    return this.service.updateAvailability(user.id, availability);
  }
}
