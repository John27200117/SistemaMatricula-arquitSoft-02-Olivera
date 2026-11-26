import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetHealthUseCase } from '../application/get-health.use-case.js';
import type { HealthReport } from '../domain/health-report.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly getHealth: GetHealthUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Comprueba que el backend está activo' })
  @ApiOkResponse({
    description: 'La aplicación HTTP está activa; no comprueba dependencias externas.',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  check(): HealthReport {
    return this.getHealth.execute();
  }
}
