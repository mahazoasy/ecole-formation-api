import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(@InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>) {}

  async create(createDto: CreateEnrollmentDto): Promise<Enrollment> {
    const existing = await this.enrollmentModel.findOne({
      student_id: new Types.ObjectId(createDto.student_id),
      course_id: new Types.ObjectId(createDto.course_id),
    }).exec();
    if (existing) throw new ConflictException('Étudiant déjà inscrit à ce cours');
    const enrollment = new this.enrollmentModel({
      ...createDto,
      status: 'pending',
      payment_status: 'unpaid',
    });
    return enrollment.save();
  }

  async findAll(status?: string, payment_status?: string): Promise<Enrollment[]> {
    const filter: any = {};
    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;
    return this.enrollmentModel.find(filter).populate('student_id course_id').exec();
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findById(id).exec();
    if (!enrollment) throw new NotFoundException('Inscription non trouvée');
    return enrollment;
  }

  async complete(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findById(id);
    if (!enrollment) throw new NotFoundException('Inscription non trouvée');
    if (enrollment.status !== 'active') throw new BadRequestException('Seule une inscription active peut être marquée comme terminée');
    enrollment.status = 'completed';
    return enrollment.save();
  }

  async updatePaymentStatus(id: string, payment_status: string, status?: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentModel.findById(id);
    if (!enrollment) throw new NotFoundException('Inscription non trouvée');
    enrollment.payment_status = payment_status;
    if (status) enrollment.status = status;
    return enrollment.save();
  }
}