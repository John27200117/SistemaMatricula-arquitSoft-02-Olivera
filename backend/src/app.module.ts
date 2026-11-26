import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module.js';
import { EnrollmentModule } from './modules/enrollment/enrollment.module.js';
import { PrismaModule } from './shared/infrastructure/prisma.module.js';
import { SupabaseAuthModule } from './shared/infrastructure/auth/supabase-auth.module.js';

@Module({
  imports: [
    PrismaModule,
    SupabaseAuthModule,
    HealthModule,
    EnrollmentModule,
  ],
})
export class AppModule {}
