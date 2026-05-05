import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const FAKE_USER = { email: 'admin@ecole.com', password: 'password123' };

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async login(email: string, password: string) {
    if (email !== FAKE_USER.email || password !== FAKE_USER.password) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const payload = { sub: 1, email };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });
    return { token, user: { id: 1, email } };
  }
}