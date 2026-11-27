import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({ description: 'Identificador del periodo académico', format: 'uuid' })
  @IsUUID('4')
  periodId!: string;

  @ApiProperty({ description: 'Identificador del grado', format: 'uuid' })
  @IsUUID('4')
  gradeId!: string;

  @ApiProperty({ description: 'Identificador de la sección', format: 'uuid' })
  @IsUUID('4')
  sectionId!: string;

  @ApiProperty({ description: 'Capacidad total; debe ser un entero positivo', minimum: 1 })
  @IsInt()
  @Min(1)
  capacity!: number;
}
