import type { ClockPort } from '../../../shared/application/clock.port.js';
import type { HealthReport } from '../domain/health-report.js';

export class GetHealthUseCase {
  constructor(private readonly clock: ClockPort) {}

  execute(): HealthReport {
    return {
      status: 'ok',
      timestamp: this.clock.now().toISOString(),
    };
  }
}
