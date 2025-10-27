import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
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
  ) {}

  async signUpUser(userDto: AuthCredentials): Promise<void> {
    const { email, password } = userDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(hashedPassword);

    const resp = this.authRepository.create({
      email,
      password: hashedPassword,
    });
    try {
      await this.authRepository.save(resp);
    } catch (err) {
      if (err?.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredts: AuthCredentials): Promise<string> {
    const { email, password } = authCredts;
    const user = await this.authRepository.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('invalid credentials');
    }
  }
}
