import { Error } from '../types/types';
import { nestErrorHelper } from './nest-error.helper';

export function prismaExceptionHelper(error: Error) {
  const errorMap = new Map([
    [
      'P2002',
      {
        name: 'UnprocessableEntityError',
        message:
          error?.message ?? error?.meta?.target ?? 'Data already exists.',
      },
    ],
    [
      'P2025',
      {
        name: 'NotFoundError',
        message: error?.message ?? error?.meta?.cause ?? 'Data not found.',
      },
    ],
    [
      'P2014',
      {
        name: 'UnprocessableEntityError',
        message:
          error?.message ?? error?.meta?.cause ?? 'Unique constraint failed.',
      },
    ],
    [
      'default',
      {
        name: 'default',
        message: error?.message ?? error?.meta?.cause ?? 'Bad Request',
      },
    ],
  ]);

  const errorObject = errorMap.get(error.code) ?? errorMap.get('default');

  nestErrorHelper({
    name: errorObject.name,
    message: errorObject.message,
  });
}
