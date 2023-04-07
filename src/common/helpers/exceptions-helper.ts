import { Error } from '../types/types';
import { nestErrorHelper } from './nest-error.helper';
import { prismaExceptionHelper } from './prisma-error.helper';

export function exceptionsFilter(error: Error) {
  'code' in error ? prismaExceptionHelper(error) : nestErrorHelper(error);
}
