import { Controller, Post, Headers, HttpCode, HttpStatus, RawBody, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private config: ConfigService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @Post('payment')
  @ApiOperation({ summary: 'Webhook de paiement' })
  async handlePaymentWebhook(
    @Headers('x-webhook-signature') signature: string,
    @RawBody() rawBody: Buffer,
  ) {
    // Vérifier que le body n'est pas vide
    if (!rawBody || rawBody.length === 0) {
      throw new HttpException(
        { success: false, message: 'Body requis' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!signature) {
      throw new HttpException(
        { success: false, message: 'Signature invalide' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const secret = this.config.get('WEBHOOK_SECRET');
    const crypto = require('crypto');
    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    
    if (signature !== expectedSignature) {
      throw new HttpException(
        { success: false, message: 'Signature invalide' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = JSON.parse(rawBody.toString());
    if (payload.event === 'payment.succeeded') {
      const enrollmentId = payload.data.enrollment_id;
      try {
        const updated = await this.enrollmentsService.updatePaymentStatus(enrollmentId, 'paid', 'active');
        return { success: true, received: true };
      } catch (error) {
        throw new HttpException(
          { success: false, message: 'Enrollment non trouvé' },
          HttpStatus.NOT_FOUND,
        );
      }
    }
    
    throw new HttpException(
      { success: false, message: 'Événement non supporté' },
      HttpStatus.BAD_REQUEST,
    );
  }
}