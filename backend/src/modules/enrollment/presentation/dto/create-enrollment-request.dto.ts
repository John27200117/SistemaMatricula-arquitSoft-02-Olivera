
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateEnrollmentRequestDto {
  @ApiProperty({ description: 'Identificador del estudiante' })
  @IsUUID('4')
  studentId!: string;

  @ApiProperty({ description: 'Identificador de la vacante seleccionada' })
  @IsUUID('4')
  vacancyId!: string;

  @ApiProperty({ description: 'Identificador del tipo de matrícula' })
  @IsUUID('4')
  enrollmentTypeId!: string;
}
