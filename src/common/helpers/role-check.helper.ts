import { Role } from '@prisma/client';

export function isRole(role: Role, ...args: Role[]) {
  return args.includes(role);
}

export function isNotRole(userRole: Role, role: Role) {
  return userRole !== role;
}

export function isRoleCheck(role: Role, ...args: Role[]) {
  !args.includes(role) && throwRoleException(args);
}

export function isNotRoleCheck(userRole: Role, role: Role) {
  userRole === role && throwNotRoleException(role);
}

function throwRoleException(args: Role[]) {
  throw {
    name: 'UnauthorizedError',
    message: `Permissão negada. Você precisa ser um ${args.join(
      ' ou ',
    )} para acessar este recurso.`,
  };
}

function throwNotRoleException(role: Role) {
  throw {
    name: 'UnauthorizedError',
    message: `Permissão negada. Um ${role} não tem acesso este recurso.`,
  };
}
