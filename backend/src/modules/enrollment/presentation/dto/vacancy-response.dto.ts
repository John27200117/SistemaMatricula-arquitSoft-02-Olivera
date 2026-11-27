import { ApiProperty } from '@nestjs/swagger';

export class VacancyResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) periodId!: string;
  @ApiProperty({ example: 2027 }) academicYear!: number;
  @ApiProperty({ format: 'uuid' }) educationLevelId!: string;
  @ApiProperty({ example: 'Primaria' }) educationLevelName!: string;
  @ApiProperty({ format: 'uuid' }) gradeId!: string;
  @ApiProperty({ example: '1.º grado' }) gradeName!: string;
  @ApiProperty({ format: 'uuid' }) sectionId!: string;
  @ApiProperty({ description: 'Nombre de sección registrado en el catálogo.' }) sectionName!: string;
  @ApiProperty() capacity!: number;
  @ApiProperty() occupiedCount!: number;
  @ApiProperty() availableCount!: number;
  @ApiProperty() hasAvailability!: boolean;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: Date;
}
