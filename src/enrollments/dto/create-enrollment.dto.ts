import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
export class CreateEnrollmentDto {
  @ApiProperty() @IsMongoId() student_id: string;
  @ApiProperty() @IsMongoId() course_id: string;
}