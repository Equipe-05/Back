import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { exceptionsFilter } from 'src/common/helpers/exceptions-helper';
import { JwtPayload } from 'src/common/types/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreexpiration: false,
      secretOrKey: String(process.env.JWT_SECRET),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const { email } = payload;
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user)
        throw {
          name: 'Authentication',
          message: 'Usuário não encontrado',
        };

      delete user.password;
      return user;
    } catch (error) {
      exceptionsFilter(error);
    }
  }
}
