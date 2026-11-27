import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ENROLLMENT_CATALOG_REPOSITORY } from '../domain/enrollment-catalog.repository.js';
import type { EnrollmentCatalogRepository } from '../domain/enrollment-catalog.repository.js';

@Injectable()
export class CreateVacancyUseCase {
  constructor(
    @Inject(ENROLLMENT_CATALOG_REPOSITORY)
    private readonly repository: EnrollmentCatalogRepository,
  ) {}

  async execute(input: {
    periodId: string;
    gradeId: string;
    sectionId: string;
    capacity: number;
  }) {
    if (!Number.isInteger(input.capacity) || input.capacity <= 0) {
      throw new BadRequestException('La capacidad debe ser un entero positivo.');
    }

    const period = await this.repository.findAcademicPeriodById(input.periodId);
    if (!period) {
      throw new NotFoundException('El periodo académico indicado no existe.');
    }

    const grade = await this.repository.findGradeById(input.gradeId);
    if (!grade) throw new NotFoundException('El grado indicado no existe.');

    const section = await this.repository.findSectionById(input.sectionId);
    if (!section) {
      throw new NotFoundException('La sección indicada no existe.');
    }
    if (section.gradeId !== input.gradeId) {
      throw new BadRequestException(
        'La sección indicada no pertenece al grado seleccionado.',
      );
    }

    const existing = await this.repository.findVacancyByPeriodAndSection(
      input.periodId,
      input.sectionId,
    );
    if (existing) {
      throw new ConflictException(
        'Ya existe una vacante para ese periodo y sección.',
      );
    }

    const result = await this.repository.createVacancy(input);
    if (result.status === 'DUPLICATE') {
      throw new ConflictException(
        'Ya existe una vacante para ese periodo y sección.',
      );
    }
    return result.vacancy;
  }
}
