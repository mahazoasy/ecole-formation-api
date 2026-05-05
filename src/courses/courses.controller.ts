import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, HttpCode, HttpStatus, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OpenaiService } from '../openai/openai.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly openaiService: OpenaiService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liste des cours (filtre instructor_id, tri price)' })
  @ApiQuery({ name: 'instructor_id', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['price'] })
  @ApiQuery({ name: 'direction', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query('instructor_id') instructor_id?: string, @Query('sort') sort?: string, @Query('direction') direction: 'asc' | 'desc' = 'asc') {
    const data = await this.coursesService.findAll(instructor_id, sort, direction);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail cours + formateur + nb enrollments' })
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    const enrollmentsCount = await this.coursesService.countEnrollments(id); // à implémenter
    return { success: true, data: { ...course.toObject(), enrollments_count: enrollmentsCount } };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createCourseDto: CreateCourseDto) {
    const data = await this.coursesService.create(createCourseDto);
    return { success: true, data, message: 'Cours créé' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    const data = await this.coursesService.update(id, updateCourseDto);
    return { success: true, data, message: 'Cours modifié' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    await this.coursesService.remove(id);
  }

  // OpenAI endpoints
  @Post(':id/generate-description')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async generateDescription(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    if (course.description) {
      return { success: true, data: { description: course.description, generated: false }, message: 'Description existante' };
    }
    const instructor = await this.coursesService.getInstructor(course.instructor_id);
    try {
      const description = await this.openaiService.generateCourseDescription(course.title, course.duration_hours, instructor.specialty);
      const updated = await this.coursesService.updateDescription(id, description);
      return { success: true, data: { description: updated.description, generated: true, model: this.config.get('OPENAI_MODEL') } };
    } catch (error) {
      throw new ServiceUnavailableException('OpenAI indisponible');
    }
  }

  @Get(':id/description')
  async getDescription(@Param('id') id: string) {
    const course = await this.coursesService.findOne(id);
    if (!course.description) throw new NotFoundException('Aucune description générée');
    return { success: true, data: { description: course.description } };
  }
}