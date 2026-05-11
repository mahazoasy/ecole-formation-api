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
    // Cas 1 : signature manquante → 401
    if (!signature) {
      throw new HttpException(
        { success: false, message: 'Signature invalide' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const secret = this.config.get('WEBHOOK_SECRET');
    const crypto = require('crypto');
    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    
    // Cas 2 : signature incorrecte → 401
    if (signature !== expectedSignature) {
      throw new HttpException(
        { success: false, message: 'Signature invalide' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Cas 3 : signature valide – traiter l'événement
    const payload = JSON.parse(rawBody.toString());
    if (payload.event === 'payment.succeeded') {
      const enrollmentId = payload.data.enrollment_id;
      try {
        const updated = await this.enrollmentsService.updatePaymentStatus(enrollmentId, 'paid', 'active');
        console.log('Enrollment mis à jour avec succès, ID:', (updated as any)._id);
        return { success: true, received: true };
      } catch (error) {
        throw new HttpException(
          { success: false, message: 'Enrollment non trouvé' },
          HttpStatus.NOT_FOUND,
        );
      }
    }
    
    // Cas 4 : événement non supporté
    throw new HttpException(
      { success: false, message: 'Événement non supporté' },
      HttpStatus.BAD_REQUEST,
    );
  }
}