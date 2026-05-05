import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste paginée des étudiants' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  async findAll(@Query('page') page = 1, @Query('per_page') perPage = 15, @Query('name') name?: string) {
    const { data, total, page: currentPage, lastPage } = await this.studentsService.findAll(+page, +perPage, name);
    return { success: true, data, meta: { total, current_page: currentPage, last_page: lastPage, per_page: +perPage } };
  }

  @Post()
  @ApiOperation({ summary: 'Créer un étudiant' })
  @ApiResponse({ status: 201 })
  async create(@Body() createStudentDto: CreateStudentDto) {
    const data = await this.studentsService.create(createStudentDto);
    return { success: true, data, message: 'Étudiant créé' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail étudiant + ses inscriptions' })
  async findOne(@Param('id') id: string) {
    const data = await this.studentsService.findOne(id);
    return { success: true, data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    const data = await this.studentsService.update(id, updateStudentDto);
    return { success: true, data, message: 'Étudiant modifié' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(id);
  }
}