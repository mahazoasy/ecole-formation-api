import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const newStudent = new this.studentModel(createStudentDto);
    return newStudent.save();
  }

  async findAll(page = 1, limit = 15, name?: string): Promise<{ data: Student[]; total: number; page: number; lastPage: number }> {
    const filter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.studentModel.find(filter).skip(skip).limit(limit).exec(),
      this.studentModel.countDocuments(filter),
    ]);
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) throw new NotFoundException('Étudiant non trouvé');
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const updated = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Étudiant non trouvé');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Étudiant non trouvé');
  }
}