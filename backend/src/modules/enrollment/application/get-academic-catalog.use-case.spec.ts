import { jest } from '@jest/globals';
import { GetAcademicCatalogUseCase } from './get-academic-catalog.use-case.js';
import type {
  AcademicCatalogRecord,
  EnrollmentCatalogRepository,
} from '../domain/enrollment-catalog.repository.js';

describe('GetAcademicCatalogUseCase', () => {
  it('returns academic periods and the nested education catalog from the repository', async () => {
    const catalog: AcademicCatalogRecord = {
      academicPeriods: [{ id: 'period-2027', academicYear: 2027 }],
      educationLevels: [
        {
          id: 'level-primary',
          code: 'PRIMARIA',
          displayName: 'Primaria',
          sortOrder: 2,
          grades: [
            {
              id: 'grade-1',
              displayName: '1.º grado',
              sortOrder: 1,
              sections: [],
            },
          ],
        },
      ],
    };
    const findAcademicCatalog = jest.fn<EnrollmentCatalogRepository['findAcademicCatalog']>();
    findAcademicCatalog.mockResolvedValue(catalog);
    const repository = {
      findAcademicCatalog,
    } as unknown as EnrollmentCatalogRepository;
    const useCase = new GetAcademicCatalogUseCase(repository);

    await expect(useCase.execute()).resolves.toEqual(catalog);
    expect(repository.findAcademicCatalog).toHaveBeenCalledTimes(1);
  });
});
