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
  @ApiProperty({ example: 30 }) capacity!: number;
  @ApiProperty({ example: 12 }) occupiedCount!: number;
  @ApiProperty({ example: 18 }) availableCount!: number;
  @ApiProperty({ example: true }) hasAvailability!: boolean;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt!: Date;
}
