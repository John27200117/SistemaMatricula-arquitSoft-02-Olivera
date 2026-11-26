import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class StartReviewDto {
  @ApiProperty({
    description: 'Identificador del administrador que inicia la revisión (demo local)',
  })
  @IsUUID('4')
  actorUserId!: string;
}
