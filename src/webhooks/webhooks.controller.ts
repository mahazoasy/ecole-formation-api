import { Controller, Post, Headers, Body, HttpCode, HttpStatus, RawBody } from '@nestjs/common';
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de paiement' })
  async handlePaymentWebhook(@Headers('x-webhook-signature') signature: string, @RawBody() rawBody: Buffer) {
    if (!signature) return { success: false, message: 'Signature manquante' };

    const secret = this.config.get('WEBHOOK_SECRET');
    const expectedSignature = 'sha256=' + require('crypto').createHmac('sha256', secret).update(rawBody).digest('hex');
    if (signature !== expectedSignature) {
      return { success: false, message: 'Signature invalide' };
    }

    const payload = JSON.parse(rawBody.toString());
    if (payload.event === 'payment.succeeded') {
      const enrollmentId = payload.data.enrollment_id;
      try {
        await this.enrollmentsService.updatePaymentStatus(enrollmentId, 'paid', 'active');
        return { success: true, received: true };
      } catch (error) {
        return { success: false, message: 'Enrollment non trouvé' };
      }
    }
    return { success: false, message: 'Événement non supporté' };
  }
}