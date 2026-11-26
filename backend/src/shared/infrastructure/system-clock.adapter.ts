import { Injectable } from '@nestjs/common';
import type { ClockPort } from '../application/clock.port.js';

@Injectable()
export class SystemClockAdapter implements ClockPort {
  now(): Date {
    return new Date();
  }
}
