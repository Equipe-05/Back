import { Error } from '../types/types';
import { nestErrorHelper } from './nest-error.helper';

export function prismaExceptionHelper(error: Error) {
  // if (error.code === 'P2002') {
  //   nestErrorHelper({
  //     name: 'UnprocessableEntityError',
  //     message: error?.meta?.target ?? 'Data already exists.',
  //   });
  // } else if (error.code === 'P2025') {
  //   nestErrorHelper({
  //     name: 'NotFoundError',
  //     message: error?.meta?.cause ?? 'Data not found.',
  //   });
  // } else if (error.code === 'P2014') {
  //   nestErrorHelper({
  //     name: 'UnprocessableEntityError',
  //     message: error?.meta?.cause ?? 'Unique constraint failed.',
  //   });
  // } else {
  //   nestErrorHelper({
  //     name: 'default',
  //     message: error?.meta?.cause ?? error?.message ?? 'Bad Request',
  //   });
  // }

  const errorMap = new Map([
    [
      'P2002',
      {
        name: 'UnprocessableEntityError',
        message: (error: Error) =>
          error?.meta?.target ?? 'Data already exists.',
      },
    ],
    [
      'P2025',
      {
        name: 'NotFoundError',
        message: (error: Error) => error?.meta?.cause ?? 'Data not found.',
      },
    ],
    [
      'P2014',
      {
        name: 'UnprocessableEntityError',
        message: (error: Error) =>
          error?.meta?.cause ?? 'Unique constraint failed.',
      },
    ],
    [
      'default',
      {
        name: 'default',
        message: (error: Error) =>
          error?.meta?.cause ?? error?.message ?? 'Bad Request',
      },
    ],
  ]);

  const errorObject = errorMap.get(error.code) ?? errorMap.get('default');

  nestErrorHelper({
    name: errorObject.name,
    message: errorObject.message(error),
  });
}
