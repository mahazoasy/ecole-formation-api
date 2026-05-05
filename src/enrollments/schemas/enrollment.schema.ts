import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  student_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId;

  @Prop({ type: String, enum: ['pending', 'active', 'completed'], default: 'pending' })
  status: string;

  @Prop({ type: String, enum: ['unpaid', 'paid'], default: 'unpaid' })
  payment_status: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);