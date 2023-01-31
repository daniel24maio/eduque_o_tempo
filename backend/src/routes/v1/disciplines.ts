import { Router, Request, Response, NextFunction } from 'express';

import { FindOptions, Op, WhereOptions } from 'sequelize';

import { getPaginationInfo } from '~/utils/pagination';

import { Discipline, DisciplineDTO } from '~/models/discipline';
import {
  createDiscipline,
  deleteDiscipline,
  getDisciplineByPk,
  listDisciplines,
  updateDiscipline
} from '~/controllers/disciplines';
import { disciplinesView, disciplineView } from '~/views/disciplines';

import {
  DisciplineCreationError,
  InvalidDisciplineRequestBodyError
} from '~/errors/discipline';

const disciplines = Router();

type ListDisciplinesRequestQuery = {
  page?: string;
  size?: string;
  name?: string;
  userId?: string;
};

type CreateDisciplineRequestBody = { discipline: DisciplineDTO };
type DeleteDisciplineRequestParams = { id: string };

type GetDisciplineRequestParms = { id: string };

type UpdateDisciplineRequestBody = { discipline: DisciplineDTO };
type UpdateDisciplineRequestParams = { id: string };

disciplines.get(
  '/',
  async (
    req: Request<{}, {}, {}, ListDisciplinesRequestQuery>,
    res: Response
  ) => {
    const page = req.query.page;
    const size = req.query.size;
    const name = req.query.name;
    const userId = req.query.userId;

    const where: WhereOptions = {};

    if (name) where.name = { [Op.like]: '%' + name + '%' };
    if (userId) where.userId = { [Op.like]: '%' + userId + '%' };

    const paginationInfo = getPaginationInfo(
      Number.parseInt(page as string),
      Number.parseInt(size as string)
    );
    const options: FindOptions = {
      where,
      limit: paginationInfo.limit,
      offset: paginationInfo.offset
    };

    const disciplines = await listDisciplines(options);

    res.status(200).json(disciplinesView(disciplines, paginationInfo));
  }
);

disciplines.get(
  '/:id',
  async (
    req: Request<GetDisciplineRequestParms>,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const discipline = await getDisciplineByPk(id);

    if (!(discipline instanceof Discipline)) return next(discipline);

    res.status(200).json({ discipline: disciplineView(discipline) });
  }
);

disciplines.post(
  '/',
  async (
    req: Request<{}, {}, CreateDisciplineRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const reqDiscipline = req.body.discipline;

    const invalidCreateDisciplineRequest =
      new InvalidDisciplineRequestBodyError(
        'invalid create discipline request body',
        []
      );

    if (!reqDiscipline) {
      invalidCreateDisciplineRequest.fields.push({
        field: 'discipline',
        description: "should have an object 'discipline'"
      });
      return next(invalidCreateDisciplineRequest);
    }

    const name = reqDiscipline.name;

    if (!name) {
      if (!name)
        invalidCreateDisciplineRequest.fields.push({
          field: 'name',
          description: "the discipline object should have an attribute 'name'"
        });
      return next(invalidCreateDisciplineRequest);
    }

    reqDiscipline.userId = req.user?.id as string;

    const discipline = await createDiscipline(reqDiscipline);

    if (!(discipline instanceof Discipline))
      return next(discipline as DisciplineCreationError);

    res.status(201).json({ discipline: disciplineView(discipline) });
  }
);

disciplines.delete(
  '/:id',
  async (
    req: Request<DeleteDisciplineRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    const result = await deleteDiscipline(req.params.id);

    if (!result) {
      return res.status(204).send();
    }

    return next(result);
  }
);

disciplines.patch(
  '/:id',
  async (
    req: Request<
      UpdateDisciplineRequestParams,
      {},
      UpdateDisciplineRequestBody
    >,
    res: Response,
    next: NextFunction
  ) => {
    const reqDiscipline = req.body.discipline;

    const invalidUpdateDisciplineRequestBody =
      new InvalidDisciplineRequestBodyError(
        'invalid update discipline request body',
        []
      );

    if (!reqDiscipline) {
      invalidUpdateDisciplineRequestBody.fields.push({
        field: 'discipline',
        description: "should have an object 'discipline'"
      });
      return next(invalidUpdateDisciplineRequestBody);
    }

    const discipline = await updateDiscipline(req.params.id, reqDiscipline);

    if (!(discipline instanceof Discipline)) return next(discipline);

    res.status(200).send({ discipline: disciplineView(discipline) });
  }
);

export default disciplines;
