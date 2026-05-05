import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StudentsService } from './students/students.service';
import { InstructorsService } from './instructors/instructors.service';
import { CoursesService } from './courses/courses.service';
import { EnrollmentsService } from './enrollments/enrollments.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const studentsService = app.get(StudentsService);
  const instructorsService = app.get(InstructorsService);
  const coursesService = app.get(CoursesService);
  const enrollmentsService = app.get(EnrollmentsService);

  // 1. Créer 3 formateurs 
  const instructor1 = await instructorsService.create({
    name: 'Rakotoarisoa Jean',
    email: 'jean.rakotoarisoa@ecole.mg',
    specialty: 'Développement Web et Mobile',
  });
  const instructor2 = await instructorsService.create({
    name: 'Razafindratovo Marie',
    email: 'marie.razafindratovo@ecole.mg',
    specialty: 'Data Science et Intelligence Artificielle',
  });
  const instructor3 = await instructorsService.create({
    name: 'Randrianasolo Pierre',
    email: 'pierre.randrianasolo@ecole.mg',
    specialty: 'Marketing Digital et E-commerce',
  });
  console.log('Formateurs créés');

  // 2. Créer 5 cours 
  const course1 = await coursesService.create({
    title: 'Introduction au Développement Web avec Laravel',
    price: 199000, 
    duration_hours: 30,
    instructor_id: (instructor1 as any)._id.toString(),
  });
  const course2 = await coursesService.create({
    title: 'Frameworks JavaScript : React et Vue.js',
    price: 249000,
    duration_hours: 40,
    instructor_id: (instructor1 as any)._id.toString(),
  });
  const course3 = await coursesService.create({
    title: 'Python pour l’Analyse de Données',
    price: 299000,
    duration_hours: 50,
    instructor_id: (instructor2 as any)._id.toString(),
  });
  const course4 = await coursesService.create({
    title: 'Stratégies SEO pour le Marché Malgache',
    price: 149000,
    duration_hours: 20,
    instructor_id: (instructor3 as any)._id.toString(),
  });
  const course5 = await coursesService.create({
    title: 'Gestion des Réseaux Sociaux et Community Management',
    price: 179000,
    duration_hours: 25,
    instructor_id: (instructor3 as any)._id.toString(),
  });
  console.log('Cours créés');

  // 3. Créer 4 étudiants 
  const student1 = await studentsService.create({
    name: 'Andriamihaja Alice',
    email: 'alice.andriamihaja@mail.mg',
    phone: '+261 32 12 345 67',
  });
  const student2 = await studentsService.create({
    name: 'Randrianarivelo Bob',
    email: 'bob.randrianarivelo@mail.mg',
    phone: '',
  });
  const student3 = await studentsService.create({
    name: 'Ravelomanana Charlie',
    email: 'charlie.ravelomanana@mail.mg',
    phone: '+261 34 56 789 01',
  });
  const student4 = await studentsService.create({
    name: 'Rasoamampionona Diana',
    email: 'diana.rasoamampionona@mail.mg',
    phone: '',
  });
  console.log('Étudiants créés');

  // 4. Créer 6 inscriptions
  await enrollmentsService.create({
    student_id: (student1 as any)._id.toString(),
    course_id: (course1 as any)._id.toString(),
  });
  await enrollmentsService.create({
    student_id: (student1 as any)._id.toString(),
    course_id: (course2 as any)._id.toString(),
  });
  await enrollmentsService.create({
    student_id: (student2 as any)._id.toString(),
    course_id: (course3 as any)._id.toString(),
  });
  await enrollmentsService.create({
    student_id: (student3 as any)._id.toString(),
    course_id: (course1 as any)._id.toString(),
  });
  await enrollmentsService.create({
    student_id: (student4 as any)._id.toString(),
    course_id: (course4 as any)._id.toString(),
  });
  await enrollmentsService.create({
    student_id: (student4 as any)._id.toString(),
    course_id: (course5 as any)._id.toString(),
  });
  console.log('Inscriptions créées');

  console.log('Seed terminé !');
  await app.close();
}
bootstrap();