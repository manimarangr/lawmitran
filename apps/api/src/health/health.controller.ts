import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', service: 'lawmitran-api', timestamp: new Date().toISOString() };
  }
}
