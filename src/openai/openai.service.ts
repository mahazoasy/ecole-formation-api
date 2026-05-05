import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenaiService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.getOrThrow<string>('OPENAI_API_KEY');
    this.baseUrl = this.config.getOrThrow<string>('OPENAI_BASE_URL');
    this.model = this.config.getOrThrow<string>('OPENAI_MODEL');
  }

  async generateCourseDescription(title: string, duration: number, specialty: string): Promise<string> {
    const systemPrompt = 'Tu es un expert en marketing de formation. Tu rédiges des descriptions courtes et percutantes pour des pages de cours en ligne. Réponds uniquement en français. Maximum 4 phrases.';
    const userPrompt = `Génère une description marketing pour ce cours :
Titre : ${title}
Durée : ${duration} heures
Formateur spécialisé en : ${specialty}`;
    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI error:', error.response?.data || error.message);
      throw new InternalServerErrorException('OpenAI service unavailable');
    }
  }
}