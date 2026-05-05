import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Instructors')
@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des formateurs' })
  async findAll() {
    const data = await this.instructorsService.findAll();
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un formateur' })
  async create(@Body() createInstructorDto: CreateInstructorDto) {
    const data = await this.instructorsService.create(createInstructorDto);
    return { success: true, data, message: 'Formateur créé' };
  }
}