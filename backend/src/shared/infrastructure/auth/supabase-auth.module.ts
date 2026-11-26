import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module.js';
import { SupabaseAuthService } from './supabase-auth.service.js';
import { SupabaseAuthGuard } from './supabase-auth.guard.js';
import { RolesGuard } from './roles.guard.js';

@Module({
  imports: [PrismaModule],
  providers: [
    SupabaseAuthService,
    SupabaseAuthGuard,
    RolesGuard,
  ],
  exports: [
    SupabaseAuthService,
    SupabaseAuthGuard,
    RolesGuard,
  ],
})
export class SupabaseAuthModule {}
