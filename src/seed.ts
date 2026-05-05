import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StudentsService } from './students/students.service';
import { InstructorsService } from './instructors/instructors.service';
import { CoursesService } from './courses/courses.service';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { CreateStudentDto } from './students/dto/create-student.dto';
import { CreateInstructorDto } from './instructors/dto/create-instructor.dto';
import { CreateCourseDto } from './courses/dto/create-course.dto';
import { CreateEnrollmentDto } from './enrollments/dto/create-enrollment.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const studentsService = app.get(StudentsService);
  const instructorsService = app.get(InstructorsService);
  const coursesService = app.get(CoursesService);
  const enrollmentsService = app.get(EnrollmentsService);

  // 1. Créer 3 formateurs
  const instructor1 = await instructorsService.create({ name: 'Jean Dupont', email: 'jean@ecole.com', specialty: 'Développement Web' });
  const instructor2 = await instructorsService.create({ name: 'Marie Curie', email: 'marie@ecole.com', specialty: 'Data Science' });
  const instructor3 = await instructorsService.create({ name: 'Pierre Martin', email: 'pierre@ecole.com', specialty: 'Marketing Digital' });
  console.log('Formateurs créés');

  // 2. Créer 5 cours
  const course1 = await coursesService.create({ title: 'Introduction à Node.js', price: 199, duration_hours: 30, instructor_id: (instructor1 as any)._id.toString() });
  const course2 = await coursesService.create({ title: 'React Avancé', price: 249, duration_hours: 40, instructor_id: (instructor1 as any)._id.toString() });
  const course3 = await coursesService.create({ title: 'Python pour Data Science', price: 299, duration_hours: 50, instructor_id: (instructor2 as any)._id.toString() });
  const course4 = await coursesService.create({ title: 'SEO et Référencement', price: 149, duration_hours: 20, instructor_id: (instructor3 as any)._id.toString() });
  const course5 = await coursesService.create({ title: 'Stratégie Social Media', price: 179, duration_hours: 25, instructor_id: (instructor3 as any)._id.toString() });
  console.log('Cours créés');

  // 3. Créer 4 étudiants
  const student1 = await studentsService.create({ name: 'Alice', email: 'alice@mail.com', phone: '0612345678' });
  const student2 = await studentsService.create({ name: 'Bob', email: 'bob@mail.com', phone: '' });
  const student3 = await studentsService.create({ name: 'Charlie', email: 'charlie@mail.com', phone: '0678901234' });
  const student4 = await studentsService.create({ name: 'Diana', email: 'diana@mail.com', phone: '' });
  console.log('Étudiants créés');

  // 4. Créer 6 inscriptions
  await enrollmentsService.create({ student_id: (student1 as any)._id.toString(), course_id: (course1 as any)._id.toString() });
  await enrollmentsService.create({ student_id: (student1 as any)._id.toString(), course_id: (course2 as any)._id.toString() });
  await enrollmentsService.create({ student_id: (student2 as any)._id.toString(), course_id: (course3 as any)._id.toString() });
  await enrollmentsService.create({ student_id: (student3 as any)._id.toString(), course_id: (course1 as any)._id.toString() });
  await enrollmentsService.create({ student_id: (student4 as any)._id.toString(), course_id: (course4 as any)._id.toString() });
  await enrollmentsService.create({ student_id: (student4 as any)._id.toString(), course_id: (course5 as any)._id.toString() });
  console.log('Inscriptions créées');

  console.log('Seed terminé !');
  await app.close();
}
bootstrap();