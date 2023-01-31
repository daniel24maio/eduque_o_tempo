import { Discipline, DisciplineDTO } from '~/models/discipline';
import {
  DisciplineCreationError,
  DisciplineNotFoundError,
  DisciplineUpdateError
} from '~/errors/discipline';

import { FindOptions, ValidationError } from 'sequelize/types';

export async function getDiscipline(
  id: string
): Promise<Discipline | DisciplineNotFoundError> {
  const discipline = await Discipline.findByPk(id);

  if (!discipline) return new DisciplineNotFoundError('discipline not found');

  return discipline;
}

export async function getDisciplineByPk(
  id: string
): Promise<Discipline | DisciplineNotFoundError> {
  const discipline = await Discipline.findOne({ where: { id } });

  if (!discipline) return new DisciplineNotFoundError('discipline not found');

  return discipline;
}

export async function findDiscipline(
  options: FindOptions
): Promise<Discipline | DisciplineNotFoundError> {
  const discipline = await Discipline.findOne(options);

  if (!discipline) return new DisciplineNotFoundError('discipline not found');

  return discipline;
}

export async function listDisciplines(
  options?: FindOptions
): Promise<{ rows: Array<Discipline>; count: number }> {
  const disciplines = await Discipline.findAndCountAll(options);

  return disciplines;
}

export async function createDiscipline(
  data: DisciplineDTO
): Promise<Discipline | DisciplineCreationError> {
  const discipline = Discipline.build({ ...data });

  try {
    await discipline.save();
  } catch (err) {
    const disciplineCreationError = new DisciplineCreationError(
      'failed on discipline creation',
      []
    );

    const validationError = err as ValidationError;

    validationError.errors.forEach((error) => {
      disciplineCreationError.fields.push({
        field: error.path as string,
        description: error.message
      });
    });

    return disciplineCreationError;
  }

  return discipline;
}

export async function deleteDiscipline(
  id: string
): Promise<DisciplineNotFoundError | void> {
  const discipline = await Discipline.findByPk(id);

  if (!discipline) return new DisciplineNotFoundError('discipline not found');

  await discipline.destroy();
}

export async function updateDiscipline(
  id: string,
  data: DisciplineDTO
): Promise<DisciplineNotFoundError | Discipline> {
  const discipline = await Discipline.findByPk(id);

  if (!discipline) return new DisciplineNotFoundError('discipline not found');

  const name = data.name;
  const userId = data.userId;

  if (name) discipline.name = name;
  if (userId) discipline.userId = userId;

  try {
    await discipline.save();
  } catch (err) {
    const disciplineUpdateError = new DisciplineUpdateError(
      'failed on discipline creation',
      []
    );

    const validationError = err as ValidationError;

    validationError.errors.forEach((error) => {
      disciplineUpdateError.fields.push({
        field: error.path as string,
        description: error.message
      });
    });

    return disciplineUpdateError;
  }

  return discipline;
}
