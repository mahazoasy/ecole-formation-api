import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Instructor, InstructorDocument } from './schemas/instructor.schema';
import { CreateInstructorDto } from './dto/create-instructor.dto';

@Injectable()
export class InstructorsService {
  constructor(@InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>) {}

  async create(createDto: CreateInstructorDto): Promise<Instructor> {
    return new this.instructorModel(createDto).save();
  }

  async findAll(): Promise<Instructor[]> {
    return this.instructorModel.find().exec();
  }

  async findOne(id: string): Promise<Instructor> {
    const instructor = await this.instructorModel.findById(id).exec();
    if (!instructor) throw new NotFoundException('Formateur non trouvé');
    return instructor;
  }
}