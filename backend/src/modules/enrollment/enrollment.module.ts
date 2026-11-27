import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma.module.js';

import { GetEnrollmentTypesUseCase } from './application/get-enrollment-types.use-case.js';
import { GetAcademicCatalogUseCase } from './application/get-academic-catalog.use-case.js';
import { CreateSectionUseCase } from './application/create-section.use-case.js';
import { GetSectionsUseCase } from './application/get-sections.use-case.js';
import { CreateVacancyUseCase } from './application/create-vacancy.use-case.js';
import { UpdateVacancyCapacityUseCase } from './application/update-vacancy-capacity.use-case.js';
import { GetVacanciesUseCase } from './application/get-vacancies.use-case.js';
import { CreateEnrollmentRequestUseCase } from './application/create-enrollment-request.use-case.js';
import { GetEnrollmentRequestsUseCase } from './application/get-enrollment-requests.use-case.js';
import { StartReviewUseCase } from './application/start-review.use-case.js';
import { GetEnrollmentRequestByIdUseCase } from './application/get-enrollment-request-by-id.use-case.js';

import {
  ENROLLMENT_CATALOG_REPOSITORY,
} from './domain/enrollment-catalog.repository.js';

import { PrismaEnrollmentCatalogRepository } from './infrastructure/prisma-enrollment-catalog.repository.js';
import { EnrollmentCatalogController } from './presentation/enrollment-catalog.controller.js';
import { ObserveEnrollmentRequestUseCase } from './application/observe-enrollment-request.use-case.js';
import { ResubmitEnrollmentRequestUseCase } from './application/resubmit-enrollment-request.use-case.js';
import { ApproveEnrollmentRequestUseCase } from './application/approve-enrollment-request.use-case.js';
import { RejectEnrollmentRequestUseCase } from './application/reject-enrollment-request.use-case.js';
import { SupabaseAuthModule } from '../../shared/infrastructure/auth/supabase-auth.module.js';

@Module({
  imports: [PrismaModule, SupabaseAuthModule],
  controllers: [EnrollmentCatalogController],
  providers: [
    PrismaEnrollmentCatalogRepository,
    {
      provide: ENROLLMENT_CATALOG_REPOSITORY,
      useExisting: PrismaEnrollmentCatalogRepository,
    },
    GetEnrollmentTypesUseCase,
    GetAcademicCatalogUseCase,
    CreateSectionUseCase,
    GetSectionsUseCase,
    CreateVacancyUseCase,
    UpdateVacancyCapacityUseCase,
    GetVacanciesUseCase,
    CreateEnrollmentRequestUseCase,
    GetEnrollmentRequestsUseCase,
    StartReviewUseCase,
    ObserveEnrollmentRequestUseCase,
    ResubmitEnrollmentRequestUseCase,
    ApproveEnrollmentRequestUseCase,
    RejectEnrollmentRequestUseCase,
    GetEnrollmentRequestByIdUseCase,
  ],
})
export class EnrollmentModule {}
