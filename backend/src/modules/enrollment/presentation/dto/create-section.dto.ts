import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ description: 'Identificador del grado al que pertenece la sección', format: 'uuid' })
  @IsUUID('4')
  gradeId!: string;

  @ApiProperty({ description: 'Nombre de la sección, entre 1 y 50 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  displayName!: string;
}
