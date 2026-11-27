import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';
import type {
  EnrollmentCatalogRepository,
  AcademicCatalogRecord,
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

  async findAcademicCatalog(): Promise<AcademicCatalogRecord> {
    const [academicPeriods, educationLevels] = await Promise.all([
      this.prisma.academicPeriod.findMany({
        select: { id: true, academicYear: true },
        orderBy: { academicYear: 'asc' },
      }),
      this.prisma.educationLevel.findMany({
        select: {
          id: true,
          code: true,
          displayName: true,
          sortOrder: true,
          grades: {
            select: {
              id: true,
              displayName: true,
              sortOrder: true,
              sections: {
                select: { id: true, displayName: true },
                orderBy: { displayName: 'asc' },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    return { academicPeriods, educationLevels };
  }

  async findVacancies(): Promise<VacancyRecord[]> {
    const vacancies = await this.prisma.vacancy.findMany({
      select: {
        id: true,
        periodId: true,
        period: { select: { academicYear: true } },
        gradeId: true,
        grade: {
          select: {
            displayName: true,
            educationLevelId: true,
            educationLevel: { select: { displayName: true } },
          },
        },
        sectionId: true,
        section: { select: { displayName: true } },
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

    return vacancies.map((vacancy) => ({
      id: vacancy.id,
      periodId: vacancy.periodId,
      academicYear: vacancy.period.academicYear,
      gradeId: vacancy.gradeId,
      sectionId: vacancy.sectionId,
      educationLevelId: vacancy.grade.educationLevelId,
      educationLevelName: vacancy.grade.educationLevel.displayName,
      gradeName: vacancy.grade.displayName,
      sectionName: vacancy.section.displayName,
      capacity: vacancy.capacity,
      occupiedCount: vacancy.occupiedCount,
      updatedAt: vacancy.updatedAt,
    }));
  }
}
