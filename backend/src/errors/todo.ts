import { Field } from '~/utils/fields';
import {
  CreationError,
  InvalidRequestBodyError,
  NotFoundError,
  UpdateError
} from '~/errors/common';

export class TodoNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);

    this.name = 'TodoNotFoundError';
  }
}

export class TodoCreationError extends CreationError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'TodoCreationError';
  }
}

export class TodoUpdateError extends UpdateError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'TodoUpdateError';
  }
}

export class InvalidTodoRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'InvalidTodoRequestBodyError';
  }
}
