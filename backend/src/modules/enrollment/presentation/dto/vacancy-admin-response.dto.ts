import { ApiProperty } from '@nestjs/swagger';

export class VacancyAdminResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) periodId!: string;
  @ApiProperty({ format: 'uuid' }) gradeId!: string;
  @ApiProperty({ format: 'uuid' }) sectionId!: string;
  @ApiProperty({ minimum: 1 }) capacity!: number;
  @ApiProperty({ minimum: 0 }) occupiedCount!: number;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt?: Date;
}

export class VacancyCapacityResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ minimum: 1 }) capacity!: number;
  @ApiProperty({ minimum: 0 }) occupiedCount!: number;
}
