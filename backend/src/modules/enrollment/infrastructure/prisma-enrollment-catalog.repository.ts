import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';
import type {
  EnrollmentCatalogRepository,
  EnrollmentTypeRecord,
  VacancyRecord,
} from '../domain/enrollment-catalog.repository.js';

@Injectable()
export class PrismaEnrollmentCatalogRepository
  implements EnrollmentCatalogRepository
{
  constructor(private readonly prisma: PrismaService) {}

  findActiveEnrollmentTypes(): Promise<EnrollmentTypeRecord[]> {
    return this.prisma.enrollmentType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        displayName: true,
      },
      orderBy: { code: 'asc' },
    });
  }

  findVacancies(): Promise<VacancyRecord[]> {
    return this.prisma.vacancy.findMany({
      select: {
        id: true,
        periodId: true,
        gradeId: true,
        sectionId: true,
        capacity: true,
        occupiedCount: true,
        updatedAt: true,
      },
      orderBy: [
        { periodId: 'asc' },
        { gradeId: 'asc' },
        { sectionId: 'asc' },
      ],
    });
  }
}
