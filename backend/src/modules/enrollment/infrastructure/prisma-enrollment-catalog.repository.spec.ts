import { jest } from '@jest/globals';
import { PrismaEnrollmentCatalogRepository } from './prisma-enrollment-catalog.repository.js';
import type { PrismaService } from '../../../shared/infrastructure/prisma.service.js';
import type {
  AcademicPeriodRecord,
  EducationLevelRecord,
} from '../domain/enrollment-catalog.repository.js';

type VacancyQueryRecord = {
  id: string;
  periodId: string;
  period: { academicYear: number };
  gradeId: string;
  grade: {
    displayName: string;
    educationLevelId: string;
    educationLevel: { displayName: string };
  };
  sectionId: string;
  section: { displayName: string };
  capacity: number;
  occupiedCount: number;
  updatedAt: Date;
};

describe('PrismaEnrollmentCatalogRepository academic catalog', () => {
  it('returns readable hierarchy and labels for vacancy records', async () => {
    const prisma = {
      academicPeriod: {
        findMany: jest.fn<() => Promise<AcademicPeriodRecord[]>>().mockResolvedValue([
          { id: 'period-2027', academicYear: 2027 },
        ]),
      },
      educationLevel: {
        findMany: jest.fn<() => Promise<EducationLevelRecord[]>>().mockResolvedValue([
          {
            id: 'level-primary',
            code: 'PRIMARIA',
            displayName: 'Primaria',
            sortOrder: 2,
            grades: [{ id: 'grade-1', displayName: '1.º grado', sortOrder: 1, sections: [] }],
          },
        ]),
      },
      vacancy: {
        findMany: jest.fn<() => Promise<VacancyQueryRecord[]>>().mockResolvedValue([
          {
            id: 'vacancy-1',
            periodId: 'period-2027',
            period: { academicYear: 2027 },
            gradeId: 'grade-1',
            grade: {
              displayName: '1.º grado',
              educationLevelId: 'level-primary',
              educationLevel: { displayName: 'Primaria' },
            },
            sectionId: 'section-1',
            section: { displayName: 'A' },
            capacity: 30,
            occupiedCount: 12,
            updatedAt: new Date('2026-11-27T00:00:00.000Z'),
          },
        ]),
      },
    };
    const repository = new PrismaEnrollmentCatalogRepository(prisma as unknown as PrismaService);

    await expect(repository.findAcademicCatalog()).resolves.toMatchObject({
      academicPeriods: [{ academicYear: 2027 }],
      educationLevels: [{ displayName: 'Primaria', grades: [{ displayName: '1.º grado', sections: [] }] }],
    });
    await expect(repository.findVacancies()).resolves.toMatchObject([
      {
        academicYear: 2027,
        educationLevelName: 'Primaria',
        gradeName: '1.º grado',
        sectionName: 'A',
      },
    ]);
  });
});
