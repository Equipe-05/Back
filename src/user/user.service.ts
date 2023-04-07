import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.compareConfirmPassword(
      createUserDto.password,
      createUserDto.confirmPassword,
    );
    const salt = await genSalt();

    const data: Prisma.UserCreateInput = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: await hash(createUserDto.password, salt),
      role: Role[createUserDto.role],
    };

    return await this.prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async findOne(id: string) {
    const user = await this.findOneById(id);
    delete user.password;

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    const data: Prisma.UserUpdateInput = {};

    if (updateUserDto.password) {
      await this.compareConfirmPassword(
        updateUserDto.password,
        updateUserDto.confirmPassword,
      );
      const salt = await genSalt();
      data.password = await hash(updateUserDto.password, salt);
    }

    data.name = updateUserDto.name ?? user.name;
    data.email = updateUserDto.email ?? user.email;
    data.role = Role[updateUserDto.role] ?? Role[user.role];

    return await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async remove(id: string) {
    await this.findOneById(id);
    await this.prisma.user.delete({ where: { id } });
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const user = await this.findOneByEmail(email);
    await this.comparePassword(password, user.password);

    return user.email;
  }

  private async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user)
      throw {
        name: 'NotFoundError',
        message: `User with id ${id} not found`,
      };

    return user;
  }

  private async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw {
        name: 'BadRequestError',
        message: 'Invalid credentials',
      };

    return user;
  }

  private async compareConfirmPassword(
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword)
      throw {
        name: 'BadRequestError',
        message: 'Password and confirm password do not match',
      };
  }

  private async comparePassword(password: string, hashPassword: string) {
    if (!(await compare(password, hashPassword)))
      throw {
        name: 'BadRequestError',
        message: 'Invalid password',
      };
  }
}
