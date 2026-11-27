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

export interface SectionCatalogRecord {
  id: string;
  gradeId: string;
  displayName: string;
  gradeName: string;
  educationLevelName: string;
}

export interface VacancyCapacityRecord {
  id: string;
  occupiedCount: number;
}

export interface CreateVacancyRecord {
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
  findAcademicCatalog(): Promise<AcademicCatalogRecord>;
  findVacancies(): Promise<VacancyRecord[]>;
  findGradeById(id: string): Promise<{ id: string } | null>;
  createSection(gradeId: string, displayName: string): Promise<SectionCatalogRecord>;
  findSections(): Promise<SectionCatalogRecord[]>;
  findAcademicPeriodById(id: string): Promise<{ id: string } | null>;
  findSectionById(id: string): Promise<{ id: string; gradeId: string } | null>;
  findVacancyByPeriodAndSection(
    periodId: string,
    sectionId: string,
  ): Promise<{ id: string } | null>;
  createVacancy(input: {
    periodId: string;
    gradeId: string;
    sectionId: string;
    capacity: number;
  }): Promise<
    | { status: 'CREATED'; vacancy: CreateVacancyRecord }
    | { status: 'DUPLICATE' }
  >;
  findVacancyCapacityById(id: string): Promise<VacancyCapacityRecord | null>;
  updateVacancyCapacity(
    id: string,
    capacity: number,
  ): Promise<'UPDATED' | 'NOT_FOUND' | 'CAPACITY_BELOW_OCCUPIED'>;
}
