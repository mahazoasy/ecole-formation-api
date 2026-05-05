import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from '../enrollments/schemas/enrollment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }])],
  controllers: [WebhooksController],
  providers: [EnrollmentsService],
})
export class WebhooksModule {}