import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { genSalt, hash, compare } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { GetUserFilterDto } from './dto/get-users-filter.dto';
import { createdUserRole } from 'src/common/util/create-user-role';

const select = {
  id: true,
  name: true,
  email: true,
  role: true,
  address: true,
  cpf: true,
  phone: true,
  createdAt: true,
  deletedAt: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserByRole(payload: CreateUserDto, userRole: Role) {
    const role: Role =
      createdUserRole.get(userRole) ?? createdUserRole.get('default');

    return await this.createUser({ ...payload, role });
  }

  async createUser(payload: CreateUserDto) {
    await this.compareConfirmPassword(
      payload.password,
      payload.confirmPassword,
    );
    const salt = await genSalt();

    const data: Prisma.UserCreateInput = {
      name: payload.name,
      email: payload.email,
      password: await hash(payload.password, salt),
      role: Role[payload?.role] ?? Role.EMPLOYEE,
      address: payload.address,
      cpf: payload.cpf,
      phone: payload.phone,
    };

    return await this.prisma.user.create({ data, select });
  }

  async getUsers(payload: GetUserFilterDto) {
    const { role, search, deleted } = payload;
    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = Role[role];
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (deleted) {
      deleted === 'TRUE'
        ? (where.deletedAt = { not: null })
        : (where.deletedAt = null);
    }

    return await this.prisma.user.findMany({ where, select });
  }

  async getUserById(id: string) {
    const user = await this.findOneById(id);
    delete user?.password;

    return user;
  }

  async updateUser(id: string, payload: UpdateUserDto) {
    const where = { id };
    const data: Prisma.UserUpdateInput = { ...payload };

    return this.prisma.user.update({ where, data, select });
  }

  async updateUserRole(id: string, payload: UpdateUserRoleDto) {
    const where = { id };
    const data: Prisma.UserUpdateInput = {
      role: Role[payload.role],
    };

    return this.prisma.user.update({ where, data, select });
  }

  async updateUserPassword(id: string, payload: UpdateUserPasswordDto) {
    const _user = await this.findOneById(id);
    const where = { id };
    const data: Prisma.UserUpdateInput = {};

    await this.compareConfirmPassword(
      payload.password,
      payload.confirmPassword,
    );
    await this.comparePassword(payload.currentPassword, _user.password);
    const _salt = await genSalt();
    data.password = await hash(payload.password, _salt);

    return this.prisma.user.update({ where, data, select });
  }

  async deleteUser(id: string) {
    const where = { id };
    const data = { deletedAt: new Date() };
    await this.prisma.user.update({ where, data });
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
