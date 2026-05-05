import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { InstructorsModule } from './instructors/instructors.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { OpenaiModule } from './openai/openai.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({ uri: config.get('MONGODB_URI') }),
      inject: [ConfigService],
    }),
    AuthModule,
    StudentsModule,
    InstructorsModule,
    CoursesModule,
    EnrollmentsModule,
    OpenaiModule,
    WebhooksModule,
  ],
})
export class AppModule {}