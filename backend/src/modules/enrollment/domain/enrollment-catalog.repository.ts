export const ENROLLMENT_CATALOG_REPOSITORY = Symbol('ENROLLMENT_CATALOG_REPOSITORY');

export interface EnrollmentTypeRecord {
  id: string;
  code: string;
  displayName: string;
}

export interface VacancyRecord {
  id: string;
  periodId: string;
  academicYear: number;
  gradeId: string;
  sectionId: string;
  educationLevelId: string;
  educationLevelName: string;
  gradeName: string;
  sectionName: string;
  capacity: number;
  occupiedCount: number;
  updatedAt: Date;
}

export interface AcademicPeriodRecord {
  id: string;
  academicYear: number;
}

export interface AcademicSectionRecord {
  id: string;
  displayName: string;
}

export interface AcademicGradeRecord {
  id: string;
  displayName: string;
  sortOrder: number;
  sections: AcademicSectionRecord[];
}

export interface EducationLevelRecord {
  id: string;
  code: string;
  displayName: string;
  sortOrder: number;
  grades: AcademicGradeRecord[];
}

export interface AcademicCatalogRecord {
  academicPeriods: AcademicPeriodRecord[];
  educationLevels: EducationLevelRecord[];
}

export interface EnrollmentCatalogRepository {
  findActiveEnrollmentTypes(): Promise<EnrollmentTypeRecord[]>;
  findAcademicCatalog(): Promise<AcademicCatalogRecord>;
  findVacancies(): Promise<VacancyRecord[]>;
}
