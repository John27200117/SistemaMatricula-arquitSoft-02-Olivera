import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';
import type {
  EnrollmentCatalogRepository,
  AcademicCatalogRecord,
  CreateVacancyRecord,
  EnrollmentTypeRecord,
  SectionCatalogRecord,
  VacancyCapacityRecord,
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

  findGradeById(id: string): Promise<{ id: string } | null> {
    return this.prisma.grade.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  async createSection(
    gradeId: string,
    displayName: string,
  ): Promise<SectionCatalogRecord> {
    const section = await this.prisma.section.create({
      data: { gradeId, displayName },
      select: {
        id: true,
        gradeId: true,
        displayName: true,
        grade: {
          select: {
            displayName: true,
            educationLevel: { select: { displayName: true } },
          },
        },
      },
    });

    return {
      id: section.id,
      gradeId: section.gradeId,
      displayName: section.displayName,
      gradeName: section.grade.displayName,
      educationLevelName: section.grade.educationLevel.displayName,
    };
  }

  async findSections(): Promise<SectionCatalogRecord[]> {
    const sections = await this.prisma.section.findMany({
      select: {
        id: true,
        gradeId: true,
        displayName: true,
        grade: {
          select: {
            displayName: true,
            educationLevel: { select: { displayName: true } },
          },
        },
      },
      orderBy: [
        { grade: { educationLevel: { sortOrder: 'asc' } } },
        { grade: { sortOrder: 'asc' } },
        { displayName: 'asc' },
      ],
    });

    return sections.map((section) => ({
      id: section.id,
      gradeId: section.gradeId,
      displayName: section.displayName,
      gradeName: section.grade.displayName,
      educationLevelName: section.grade.educationLevel.displayName,
    }));
  }

  findAcademicPeriodById(id: string): Promise<{ id: string } | null> {
    return this.prisma.academicPeriod.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  findSectionById(id: string): Promise<{ id: string; gradeId: string } | null> {
    return this.prisma.section.findUnique({
      where: { id },
      select: { id: true, gradeId: true },
    });
  }

  findVacancyByPeriodAndSection(
    periodId: string,
    sectionId: string,
  ): Promise<{ id: string } | null> {
    return this.prisma.vacancy.findFirst({
      where: { periodId, sectionId },
      select: { id: true },
    });
  }

  createVacancy(input: {
    periodId: string;
    gradeId: string;
    sectionId: string;
    capacity: number;
  }): Promise<
    | { status: 'CREATED'; vacancy: CreateVacancyRecord }
    | { status: 'DUPLICATE' }
  > {
    return this.prisma.$transaction(async (transaction) => {
      const lockKey = `VACANCY:${input.periodId}:${input.sectionId}`;
      await transaction.$queryRaw`
        SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))
      `;

      const existing = await transaction.vacancy.findFirst({
        where: { periodId: input.periodId, sectionId: input.sectionId },
        select: { id: true },
      });
      if (existing) return { status: 'DUPLICATE' };

      const vacancy = await transaction.vacancy.create({
        data: input,
        select: {
          id: true,
          periodId: true,
          gradeId: true,
          sectionId: true,
          capacity: true,
          occupiedCount: true,
          updatedAt: true,
        },
      });
      return { status: 'CREATED', vacancy };
    });
  }

  findVacancyCapacityById(id: string): Promise<VacancyCapacityRecord | null> {
    return this.prisma.vacancy.findUnique({
      where: { id },
      select: { id: true, occupiedCount: true },
    });
  }

  async updateVacancyCapacity(
    id: string,
    capacity: number,
  ): Promise<'UPDATED' | 'NOT_FOUND' | 'CAPACITY_BELOW_OCCUPIED'> {
    const result = await this.prisma.vacancy.updateMany({
      where: { id, occupiedCount: { lte: capacity } },
      data: { capacity },
    });

    if (result.count > 0) return 'UPDATED';

    const exists = await this.prisma.vacancy.findUnique({
      where: { id },
      select: { id: true },
    });
    return exists ? 'CAPACITY_BELOW_OCCUPIED' : 'NOT_FOUND';
  }
}
