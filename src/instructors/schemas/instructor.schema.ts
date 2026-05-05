import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstructorDocument = Instructor & Document;

@Schema({ timestamps: true })
export class Instructor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  specialty: string;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);