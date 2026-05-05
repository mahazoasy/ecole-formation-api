import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'payment_status', required: false })
  async findAll(@Query('status') status?: string, @Query('payment_status') payment_status?: string) {
    const data = await this.enrollmentsService.findAll(status, payment_status);
    return { success: true, data };
  }

  @Post()
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409, description: 'Déjà inscrit' })
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    const data = await this.enrollmentsService.create(createEnrollmentDto);
    return { success: true, data, message: 'Inscription enregistrée' };
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string) {
    const data = await this.enrollmentsService.complete(id);
    return { success: true, data, message: 'Cours terminé' };
  }
}