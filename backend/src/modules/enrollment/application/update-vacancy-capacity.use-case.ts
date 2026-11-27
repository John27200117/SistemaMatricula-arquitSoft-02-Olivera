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
export class UpdateVacancyCapacityUseCase {
  constructor(
    @Inject(ENROLLMENT_CATALOG_REPOSITORY)
    private readonly repository: EnrollmentCatalogRepository,
  ) {}

  async execute(id: string, capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new BadRequestException('La capacidad debe ser un entero positivo.');
    }

    const result = await this.repository.updateVacancyCapacity(id, capacity);
    if (result === 'NOT_FOUND') {
      throw new NotFoundException('La vacante indicada no existe.');
    }
    if (result === 'CAPACITY_BELOW_OCCUPIED') {
      throw new ConflictException(
        'La capacidad no puede ser menor que la cantidad de vacantes ocupadas.',
      );
    }

    const vacancy = await this.repository.findVacancyCapacityById(id);
    if (!vacancy) throw new NotFoundException('La vacante indicada no existe.');
    return { id: vacancy.id, capacity, occupiedCount: vacancy.occupiedCount };
  }
}
