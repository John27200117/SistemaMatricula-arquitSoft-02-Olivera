import { Inject, Injectable } from '@nestjs/common';
import {
  ENROLLMENT_CATALOG_REPOSITORY,
} from '../domain/enrollment-catalog.repository.js';
import type {
  EnrollmentCatalogRepository,
} from '../domain/enrollment-catalog.repository.js';

@Injectable()
export class GetEnrollmentTypesUseCase {
  constructor(
    @Inject(ENROLLMENT_CATALOG_REPOSITORY)
    private readonly repository: EnrollmentCatalogRepository,
  ) {}

  execute() {
    return this.repository.findActiveEnrollmentTypes();
  }
}
