import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credts.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authDto: AuthCredentials): Promise<void> {
    await this.authService.signUpUser(authDto);
  }
  @Post('/signin')
  async signIn(@Body() authDto: AuthCredentials): Promise<void> {
    await this.authService.signIn(authDto);
  }
}
