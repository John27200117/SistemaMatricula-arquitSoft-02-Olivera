import { ApiProperty } from '@nestjs/swagger';

export class AcademicPeriodResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 2027 })
  academicYear!: number;
}

export class AcademicSectionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Nombre de la sección registrado en el catálogo.' })
  displayName!: string;
}

export class AcademicGradeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: '1.º grado' })
  displayName!: string;

  @ApiProperty({ example: 1 })
  sortOrder!: number;

  @ApiProperty({ type: [AcademicSectionResponseDto] })
  sections!: AcademicSectionResponseDto[];
}

export class EducationLevelResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'PRIMARIA' })
  code!: string;

  @ApiProperty({ example: 'Primaria' })
  displayName!: string;

  @ApiProperty({ example: 2 })
  sortOrder!: number;

  @ApiProperty({ type: [AcademicGradeResponseDto] })
  grades!: AcademicGradeResponseDto[];
}

export class AcademicCatalogResponseDto {
  @ApiProperty({ type: [AcademicPeriodResponseDto] })
  academicPeriods!: AcademicPeriodResponseDto[];

  @ApiProperty({ type: [EducationLevelResponseDto] })
  educationLevels!: EducationLevelResponseDto[];
}
