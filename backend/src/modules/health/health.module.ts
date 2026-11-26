import { Module } from '@nestjs/common';
import { CLOCK_PORT } from '../../shared/application/clock.port.js';
import type { ClockPort } from '../../shared/application/clock.port.js';
import { SystemClockAdapter } from '../../shared/infrastructure/system-clock.adapter.js';
import { GetHealthUseCase } from './application/get-health.use-case.js';
import { HealthController } from './presentation/health.controller.js';

@Module({
  controllers: [HealthController],
  providers: [
    SystemClockAdapter,
    {
      provide: CLOCK_PORT,
      useExisting: SystemClockAdapter,
    },
    {
      provide: GetHealthUseCase,
      useFactory: (clock: ClockPort) => new GetHealthUseCase(clock),
      inject: [CLOCK_PORT],
    },
  ],
})
export class HealthModule {}
