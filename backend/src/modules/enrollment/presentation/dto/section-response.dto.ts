import { ApiProperty } from '@nestjs/swagger';

export class SectionResponseDto {
  @ApiProperty({ format: 'uuid' }) id!: string;
  @ApiProperty({ format: 'uuid' }) gradeId!: string;
  @ApiProperty() displayName!: string;
  @ApiProperty() gradeName!: string;
  @ApiProperty() educationLevelName!: string;
}
