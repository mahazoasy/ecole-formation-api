import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from '../enrollments/schemas/enrollment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]), EnrollmentsModule],
  controllers: [WebhooksController],
  providers: [EnrollmentsService],
})
export class WebhooksModule {}