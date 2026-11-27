import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateVacancyCapacityDto {
  @ApiProperty({ description: 'Nueva capacidad total; debe ser un entero positivo', minimum: 1 })
  @IsInt()
  @Min(1)
  capacity!: number;
}
