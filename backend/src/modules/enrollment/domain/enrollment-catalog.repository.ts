export const ENROLLMENT_CATALOG_REPOSITORY = Symbol('ENROLLMENT_CATALOG_REPOSITORY');

export interface EnrollmentTypeRecord {
  id: string;
  code: string;
  displayName: string;
}

export interface VacancyRecord {
  id: string;
  periodId: string;
  gradeId: string;
  sectionId: string;
  capacity: number;
  occupiedCount: number;
  updatedAt: Date;
}

export interface EnrollmentCatalogRepository {
  findActiveEnrollmentTypes(): Promise<EnrollmentTypeRecord[]>;
  findVacancies(): Promise<VacancyRecord[]>;
}
