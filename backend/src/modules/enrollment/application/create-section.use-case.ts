import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ENROLLMENT_CATALOG_REPOSITORY } from '../domain/enrollment-catalog.repository.js';
import type { EnrollmentCatalogRepository } from '../domain/enrollment-catalog.repository.js';

@Injectable()
export class CreateSectionUseCase {
  constructor(
    @Inject(ENROLLMENT_CATALOG_REPOSITORY)
    private readonly repository: EnrollmentCatalogRepository,
  ) {}

  async execute(input: { gradeId: string; displayName: string }) {
    const displayName = input.displayName.trim();
    if (!displayName || displayName.length > 50) {
      throw new BadRequestException(
        'El nombre de la sección es obligatorio y debe tener como máximo 50 caracteres.',
      );
    }

    const grade = await this.repository.findGradeById(input.gradeId);
    if (!grade) throw new NotFoundException('El grado indicado no existe.');

    return this.repository.createSection(input.gradeId, displayName);
  }
}
