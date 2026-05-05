import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 1 })
  duration_hours: number;

  @Prop({ type: Types.ObjectId, ref: 'Instructor', required: true })
  instructor_id: Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);