import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { exceptionsFilter } from 'src/common/helpers/exceptions.helper';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @ApiOperation({
    summary: 'Fazer login com nome de usuário e senha',
    description:
      'Faça login com credenciais de nome de usuário e senha. O nome de usuário deve estar em minúsculas. A senha deve ter pelo menos 8 caracteres, e conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um símbolo.',
  })
  async signIn(@Body(ValidationPipe) createAuthDto: AuthCredentialsDto) {
    try {
      return await this.authService.signIn(createAuthDto);
    } catch (error) {
      exceptionsFilter(error);
    }
  }

  @Get('/signed')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna usuário autenticado',
    description: 'Caso o usuário esteja autenticado, retorna o usuário.',
  })
  async signed(@GetUser() user: User) {
    return await this.authService.signed(user.id);
  }
}
