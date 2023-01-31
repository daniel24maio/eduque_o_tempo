import { Assignment, AssignmentDTO } from '~/models/assignment';
import {
  AssignmentCreationError,
  AssignmentNotFoundError,
  AssignmentUpdateError
} from '~/errors/assignment';

import { FindOptions, ValidationError } from 'sequelize/types';

export async function getAssignment(
  id: string
): Promise<Assignment | AssignmentNotFoundError> {
  const assignments = await Assignment.findByPk(id);

  if (!assignments) return new AssignmentNotFoundError('assignments not found');

  return assignments;
}

export async function getAssignmentByPk(
  id: string
): Promise<Assignment | AssignmentNotFoundError> {
  const assignments = await Assignment.findOne({ where: { id } });

  if (!assignments) return new AssignmentNotFoundError('assignments not found');

  return assignments;
}

export async function findAssignment(
  options: FindOptions
): Promise<Assignment | AssignmentNotFoundError> {
  const assignments = await Assignment.findOne(options);

  if (!assignments) return new AssignmentNotFoundError('assignments not found');

  return assignments;
}

export async function listAssignments(
  options?: FindOptions
): Promise<{ rows: Array<Assignment>; count: number }> {
  const assignmentss = await Assignment.findAndCountAll(options);

  return assignmentss;
}

export async function createAssignment(
  data: AssignmentDTO
): Promise<Assignment | AssignmentCreationError> {
  const assignments = Assignment.build({ ...data });

  try {
    await assignments.save();
  } catch (err) {
    const assignmentsCreationError = new AssignmentCreationError(
      'failed on assignments creation',
      []
    );

    const validationError = err as ValidationError;

    validationError.errors.forEach((error) => {
      assignmentsCreationError.fields.push({
        field: error.path as string,
        description: error.message
      });
    });

    return assignmentsCreationError;
  }

  return assignments;
}

export async function deleteAssignment(
  id: string
): Promise<AssignmentNotFoundError | void> {
  const assignments = await Assignment.findByPk(id);

  if (!assignments) return new AssignmentNotFoundError('assignments not found');

  await assignments.destroy();
}

export async function updateAssignment(
  id: string,
  data: AssignmentDTO
): Promise<AssignmentNotFoundError | Assignment> {
  const assignments = await Assignment.findByPk(id);

  if (!assignments) return new AssignmentNotFoundError('assignments not found');

  const name = data.name;
  const grade = data.grade;
  const disciplineId = data.disciplineId;

  if (name) assignments.name = name;
  if (grade) assignments.grade = grade;
  if (disciplineId) assignments.disciplineId = disciplineId;

  try {
    await assignments.save();
  } catch (err) {
    const assignmentsUpdateError = new AssignmentUpdateError(
      'failed on assignments creation',
      []
    );

    const validationError = err as ValidationError;

    validationError.errors.forEach((error) => {
      assignmentsUpdateError.fields.push({
        field: error.path as string,
        description: error.message
      });
    });

    return assignmentsUpdateError;
  }

  return assignments;
}
