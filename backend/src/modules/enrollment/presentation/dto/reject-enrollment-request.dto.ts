
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RejectEnrollmentRequestDto {
  @ApiProperty({
    description: 'Motivo del rechazo',
    example: 'La solicitud no cumple con los requisitos establecidos.',
    minLength: 5,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(1000)
  comment!: string;
}
