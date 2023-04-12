import { Role } from '@prisma/client';

export function isRole(role: Role, ...args: Role[]) {
  !args.includes(role) && throwRoleException(args);
}

function throwRoleException(args: Role[]) {
  throw {
    name: 'UnauthorizedError',
    message: `Permissão negada. Você precisa ser um ${args.join(
      ' ou ',
    )} para acessar este recurso.`,
  };
}
