import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty() @IsNumber() @Min(1) duration_hours: number;
  @ApiProperty() @IsMongoId() instructor_id: string;
}