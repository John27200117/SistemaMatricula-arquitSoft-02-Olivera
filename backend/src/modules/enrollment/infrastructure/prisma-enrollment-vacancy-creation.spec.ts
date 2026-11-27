import { jest } from '@jest/globals';
import { PrismaEnrollmentCatalogRepository } from './prisma-enrollment-catalog.repository.js';
import type { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

describe('PrismaEnrollmentCatalogRepository vacancy creation', () => {
  it('locks the period-section pair and rechecks duplicates before inserting', async () => {
    const transaction = {
      $queryRaw: jest.fn<() => Promise<unknown[]>>().mockResolvedValue([]),
      vacancy: {
        findFirst: jest.fn<() => Promise<{ id: string } | null>>()
          .mockResolvedValue({ id: 'existing-vacancy' }),
        create: jest.fn(),
      },
    };
    const prisma = {
      $transaction: jest.fn(async (callback: (tx: typeof transaction) => unknown) =>
        callback(transaction)),
    };
    const repository = new PrismaEnrollmentCatalogRepository(
      prisma as unknown as PrismaService,
    );

    await expect(repository.createVacancy({
      periodId: 'period-id',
      gradeId: 'grade-id',
      sectionId: 'section-id',
      capacity: 12,
    })).resolves.toEqual({ status: 'DUPLICATE' });

    expect(transaction.$queryRaw).toHaveBeenCalledTimes(1);
    expect(transaction.vacancy.create).not.toHaveBeenCalled();
  });
});
