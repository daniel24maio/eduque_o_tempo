import { Field } from '~/utils/fields';
import {
  CreationError,
  InvalidRequestBodyError,
  NotFoundError,
  UpdateError
} from '~/errors/common';

export class AssignmentNotFoundError extends NotFoundError {
  constructor(message: string) {
    super(message);

    this.name = 'AssignmentsNotFoundError';
  }
}

export class AssignmentCreationError extends CreationError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'AssignmentsCreationError';
  }
}

export class AssignmentUpdateError extends UpdateError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'AssignmentsUpdateError';
  }
}

export class InvalidAssignmentRequestBodyError extends InvalidRequestBodyError {
  constructor(message: string, fields: Array<Field>) {
    super(message, fields);

    this.name = 'InvalidAssignmentsRequestBodyError';
  }
}
