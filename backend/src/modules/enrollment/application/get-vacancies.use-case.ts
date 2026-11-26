import { Inject, Injectable } from '@nestjs/common';
import {
  ENROLLMENT_CATALOG_REPOSITORY,
} from '../domain/enrollment-catalog.repository.js';
import type {
  EnrollmentCatalogRepository,
} from '../domain/enrollment-catalog.repository.js';

@Injectable()
export class GetVacanciesUseCase {
  constructor(
    @Inject(ENROLLMENT_CATALOG_REPOSITORY)
    private readonly repository: EnrollmentCatalogRepository,
  ) {}

  async execute() {
    const vacancies = await this.repository.findVacancies();

    return vacancies.map((vacancy) => ({
      ...vacancy,
      availableCount: vacancy.capacity - vacancy.occupiedCount,
      hasAvailability: vacancy.capacity > vacancy.occupiedCount,
    }));
  }
}
