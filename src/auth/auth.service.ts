import { Injectable, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtPayload } from 'src/common/types/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const payload: JwtPayload = { email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`Generated JWT Token for email ${user.email}`);
    return { accessToken };
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const email = await this.userService.signIn(authCredentialsDto);

    if (!email) {
      throw {
        name: 'BadRequestError',
        message: 'Invalid credentials',
      };
    }

    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.signAsync(payload);

    this.logger.log(`Generated JWT Token for email ${email}`);
    return { accessToken };
  }
}
