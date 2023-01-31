import { Field } from '~/utils/fields';
import {
  CreationError,
  InvalidRequestBodyError,
  NotFoundError,
  UpdateError
} from '~/errors/common';

export class DisciplineNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);

    this.name = 'DisciplineNotFoundError';
  }
}

export class DisciplineCreationError extends CreationError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'DisciplineCreationError';
  }
}

export class DisciplineUpdateError extends UpdateError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'DisciplineUpdateError';
  }
}

export class InvalidDisciplineRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'InvalidDisciplineRequestBodyError';
  }
}
