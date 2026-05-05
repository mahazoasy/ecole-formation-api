import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Enrollment, EnrollmentDocument } from '../enrollments/schemas/enrollment.schema';
import { Instructor, InstructorDocument } from '../instructors/schemas/instructor.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
  ) {}

  async create(createDto: CreateCourseDto): Promise<Course> {
    return new this.courseModel(createDto).save();
  }

  async findAll(instructor_id?: string, sortBy?: string, sortDir: 'asc' | 'desc' = 'asc'): Promise<Course[]> {
    const filter = instructor_id ? { instructor_id: new Types.ObjectId(instructor_id) } : {};
    const sort: any = sortBy ? { [sortBy]: sortDir === 'asc' ? 1 : -1 } : {};
    return this.courseModel.find(filter).sort(sort).populate('instructor_id').exec();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).populate('instructor_id').exec();
    if (!course) throw new NotFoundException('Cours non trouvé');
    return course;
  }

  async countEnrollments(courseId: string): Promise<number> {
    return this.enrollmentModel.countDocuments({ course_id: new Types.ObjectId(courseId) }).exec();
  }

  async getInstructor(instructorId: Types.ObjectId): Promise<Instructor> {
    const instructor = await this.instructorModel.findById(instructorId).exec();
    if (!instructor) throw new NotFoundException('Formateur non trouvé');
    return instructor;
  }

  async update(id: string, updateDto: UpdateCourseDto): Promise<Course> {
    const updated = await this.courseModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Cours non trouvé');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const activeEnrollments = await this.enrollmentModel.countDocuments({ course_id: new Types.ObjectId(id), status: { $ne: 'completed' } });
    if (activeEnrollments > 0) {
      throw new BadRequestException('Impossible de supprimer un cours avec des inscriptions actives');
    }
    const result = await this.courseModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Cours non trouvé');
  }

  async updateDescription(id: string, description: string): Promise<Course> {
    const updated = await this.courseModel.findByIdAndUpdate(id, { description }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Cours non trouvé');
    return updated;
  }
}