import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthCredentials } from './dto/auth-credts.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUpUser(userDto: AuthCredentials): Promise<void> {
    const { email, password } = userDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const resp = this.authRepository.create({
      email,
      password: hashedPassword,
    });
    try {
      await this.authRepository.save(resp);
    } catch (err: unknown) {
      const pgError = err as { code?: string };
      if (pgError?.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredts: AuthCredentials): Promise<{ accessToken: string }> {
    const { email, password } = authCredts;
    const user = await this.authRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = this.jwtService.sign({ email });
      return { accessToken };
    } else {
      throw new UnauthorizedException('invalid credentials');
    }
  }
}
