import { Role } from '@prisma/client';

export const createdUserRole = new Map<Role | 'default', Role>([
  [Role.EMPLOYEE, Role.EMPLOYEE],
  [Role.FRANCHISEE, Role.EMPLOYEE],
  [Role.OPERATOR, Role.FRANCHISEE],
  [Role.MANAGER, Role.OPERATOR],
  ['default', Role.EMPLOYEE],
]);
