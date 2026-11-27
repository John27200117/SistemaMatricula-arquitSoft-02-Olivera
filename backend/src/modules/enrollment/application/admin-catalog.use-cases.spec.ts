import { jest } from '@jest/globals';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import type { EnrollmentCatalogRepository } from '../domain/enrollment-catalog.repository.js';
import { CreateSectionUseCase } from './create-section.use-case.js';
import { GetSectionsUseCase } from './get-sections.use-case.js';
import { CreateVacancyUseCase } from './create-vacancy.use-case.js';
import { UpdateVacancyCapacityUseCase } from './update-vacancy-capacity.use-case.js';

describe('Administrative section and vacancy use cases', () => {
  let repository: jest.Mocked<Pick<EnrollmentCatalogRepository,
    | 'findGradeById'
    | 'createSection'
    | 'findSections'
    | 'findAcademicPeriodById'
    | 'findSectionById'
    | 'findVacancyByPeriodAndSection'
    | 'createVacancy'
    | 'findVacancyCapacityById'
    | 'updateVacancyCapacity'
  >>;

  beforeEach(() => {
    repository = {
      findGradeById: jest.fn<EnrollmentCatalogRepository['findGradeById']>(),
      createSection: jest.fn<EnrollmentCatalogRepository['createSection']>(),
      findSections: jest.fn<EnrollmentCatalogRepository['findSections']>(),
      findAcademicPeriodById: jest.fn<EnrollmentCatalogRepository['findAcademicPeriodById']>(),
      findSectionById: jest.fn<EnrollmentCatalogRepository['findSectionById']>(),
      findVacancyByPeriodAndSection: jest.fn<EnrollmentCatalogRepository['findVacancyByPeriodAndSection']>(),
      createVacancy: jest.fn<EnrollmentCatalogRepository['createVacancy']>(),
      findVacancyCapacityById: jest.fn<EnrollmentCatalogRepository['findVacancyCapacityById']>(),
      updateVacancyCapacity: jest.fn<EnrollmentCatalogRepository['updateVacancyCapacity']>(),
    };
  });

  const repositoryPort = () => repository as unknown as EnrollmentCatalogRepository;

  it('trims a section name and requires an existing grade', async () => {
    repository.findGradeById.mockResolvedValue({ id: 'grade-id' });
    repository.createSection.mockResolvedValue({
      id: 'section-id', gradeId: 'grade-id', displayName: 'A',
      gradeName: '1.º grado', educationLevelName: 'Primaria',
    });

    const result = await new CreateSectionUseCase(repositoryPort())
      .execute({ gradeId: 'grade-id', displayName: '  A  ' });

    expect(repository.createSection).toHaveBeenCalledWith('grade-id', 'A');
    expect(result.displayName).toBe('A');
  });

  it('rejects blank or overlength section names and an unknown grade', async () => {
    const useCase = new CreateSectionUseCase(repositoryPort());
    await expect(useCase.execute({ gradeId: 'grade-id', displayName: '   ' }))
      .rejects.toBeInstanceOf(BadRequestException);
    await expect(useCase.execute({ gradeId: 'grade-id', displayName: 'x'.repeat(51) }))
      .rejects.toBeInstanceOf(BadRequestException);

    repository.findGradeById.mockResolvedValue(null);
    await expect(useCase.execute({ gradeId: 'missing', displayName: 'A' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists sections through the repository', async () => {
    repository.findSections.mockResolvedValue([]);
    await expect(new GetSectionsUseCase(repositoryPort()).execute())
      .resolves.toEqual([]);
  });

  it('creates a vacancy only for existing related records and rejects duplicates', async () => {
    repository.findAcademicPeriodById.mockResolvedValue({ id: 'period-id' });
    repository.findGradeById.mockResolvedValue({ id: 'grade-id' });
    repository.findSectionById.mockResolvedValue({ id: 'section-id', gradeId: 'grade-id' });
    repository.findVacancyByPeriodAndSection.mockResolvedValue(null);
    repository.createVacancy.mockResolvedValue({
      status: 'CREATED',
      vacancy: {
        id: 'vacancy-id', periodId: 'period-id', gradeId: 'grade-id',
        sectionId: 'section-id', capacity: 20, occupiedCount: 0,
        updatedAt: new Date('2026-11-27T00:00:00.000Z'),
      },
    });
    const useCase = new CreateVacancyUseCase(repositoryPort());
    const input = { periodId: 'period-id', gradeId: 'grade-id', sectionId: 'section-id', capacity: 20 };

    await expect(useCase.execute(input)).resolves.toMatchObject({ capacity: 20 });
    expect(repository.createVacancy).toHaveBeenCalledWith(input);

    repository.findVacancyByPeriodAndSection.mockResolvedValue({ id: 'existing-vacancy' });
    await expect(useCase.execute(input)).rejects.toBeInstanceOf(ConflictException);
    expect(repository.createVacancy).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid capacities and section-grade mismatches', async () => {
    const useCase = new CreateVacancyUseCase(repositoryPort());
    await expect(useCase.execute({ periodId: 'p', gradeId: 'g', sectionId: 's', capacity: 0 }))
      .rejects.toBeInstanceOf(BadRequestException);

    repository.findAcademicPeriodById.mockResolvedValue({ id: 'p' });
    repository.findGradeById.mockResolvedValue({ id: 'g' });
    repository.findSectionById.mockResolvedValue({ id: 's', gradeId: 'another-grade' });
    await expect(useCase.execute({ periodId: 'p', gradeId: 'g', sectionId: 's', capacity: 10 }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('maps capacity update outcomes to not-found and occupied-capacity conflicts', async () => {
    const useCase = new UpdateVacancyCapacityUseCase(repositoryPort());
    repository.updateVacancyCapacity.mockResolvedValue('NOT_FOUND');
    await expect(useCase.execute('missing', 20)).rejects.toBeInstanceOf(NotFoundException);

    repository.updateVacancyCapacity.mockResolvedValue('CAPACITY_BELOW_OCCUPIED');
    await expect(useCase.execute('vacancy-id', 5)).rejects.toBeInstanceOf(ConflictException);

    await expect(useCase.execute('vacancy-id', 0)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns the saved capacity after a successful conditional update', async () => {
    repository.updateVacancyCapacity.mockResolvedValue('UPDATED');
    repository.findVacancyCapacityById.mockResolvedValue({ id: 'vacancy-id', occupiedCount: 8 });

    await expect(
      new UpdateVacancyCapacityUseCase(repositoryPort())
        .execute('vacancy-id', 12),
    ).resolves.toEqual({ id: 'vacancy-id', capacity: 12, occupiedCount: 8 });
  });
});
