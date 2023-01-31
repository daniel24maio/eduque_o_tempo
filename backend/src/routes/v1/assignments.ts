import { Router, Request, Response, NextFunction } from 'express';

import { FindOptions, Op, WhereOptions } from 'sequelize';

import { getPaginationInfo } from '~/utils/pagination';

import { Assignment, AssignmentDTO } from '~/models/assignment';
import {
  createAssignment,
  deleteAssignment,
  getAssignmentByPk,
  listAssignments,
  updateAssignment
} from '~/controllers/assignments';
import { assignmentsView, assignmentView } from '~/views/assignments';

import {
  AssignmentCreationError,
  InvalidAssignmentRequestBodyError
} from '~/errors/assignment';

const assignments = Router();

type ListAssignmentsRequestQuery = {
  page?: string;
  size?: string;
  name?: string;
};

type CreateAssignmentRequestBody = { assignment: AssignmentDTO };
type DeleteAssignmentRequestParams = { id: string };

type GetAssignmentRequestParms = { id: string };

type UpdateAssignmentRequestBody = { assignment: AssignmentDTO };
type UpdateAssignmentRequestParams = { id: string };

assignments.get(
  '/',
  async (
    req: Request<{}, {}, {}, ListAssignmentsRequestQuery>,
    res: Response
  ) => {
    const page = req.query.page;
    const size = req.query.size;
    const name = req.query.name;

    const where: WhereOptions = {};

    if (name) where.name = { [Op.like]: '%' + name + '%' };

    const paginationInfo = getPaginationInfo(
      Number.parseInt(page as string),
      Number.parseInt(size as string)
    );
    const options: FindOptions = {
      where,
      limit: paginationInfo.limit,
      offset: paginationInfo.offset
    };

    const assignments = await listAssignments(options);

    res.status(200).json(assignmentsView(assignments, paginationInfo));
  }
);

assignments.get(
  '/:id',
  async (
    req: Request<GetAssignmentRequestParms>,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const assignment = await getAssignmentByPk(id);

    if (!(assignment instanceof Assignment)) return next(assignment);

    res.status(200).json({ assignment: assignmentView(assignment) });
  }
);

assignments.post(
  '/',
  async (
    req: Request<{}, {}, CreateAssignmentRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const reqAssignment = req.body.assignment;

    const invalidCreateAssignmentRequest =
      new InvalidAssignmentRequestBodyError(
        'invalid create assignment request body',
        []
      );

    if (!reqAssignment) {
      invalidCreateAssignmentRequest.fields.push({
        field: 'assignment',
        description: "should have an object 'assignment'"
      });
      return next(invalidCreateAssignmentRequest);
    }

    const name = reqAssignment.name;
    const grade = reqAssignment.grade;
    const disciplineId = reqAssignment.disciplineId;

    if (!name || !grade || !disciplineId) {
      if (!name)
        invalidCreateAssignmentRequest.fields.push({
          field: 'name',
          description: "the assignment object should have an attribute 'name'"
        });

      if (!grade)
        invalidCreateAssignmentRequest.fields.push({
          field: 'grade',
          description: "the assignment object should have an attribute 'grade'"
        });

      if (!disciplineId)
        invalidCreateAssignmentRequest.fields.push({
          field: 'disciplineId',
          description:
            "the assignment object should have an attribute 'disciplineId'"
        });
      return next(invalidCreateAssignmentRequest);
    }

    const assignment = await createAssignment(reqAssignment);

    if (!(assignment instanceof Assignment))
      return next(assignment as AssignmentCreationError);

    res.status(201).json({ assignment: assignmentView(assignment) });
  }
);

assignments.delete(
  '/:id',
  async (
    req: Request<DeleteAssignmentRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    const result = await deleteAssignment(req.params.id);

    if (!result) {
      return res.status(204).send();
    }

    return next(result);
  }
);

assignments.patch(
  '/:id',
  async (
    req: Request<
      UpdateAssignmentRequestParams,
      {},
      UpdateAssignmentRequestBody
    >,
    res: Response,
    next: NextFunction
  ) => {
    const reqAssignment = req.body.assignment;

    const invalidUpdateAssignmentRequestBody =
      new InvalidAssignmentRequestBodyError(
        'invalid update assignment request body',
        []
      );

    if (!reqAssignment) {
      invalidUpdateAssignmentRequestBody.fields.push({
        field: 'assignment',
        description: "should have an object 'assignment'"
      });
      return next(invalidUpdateAssignmentRequestBody);
    }

    const assignment = await updateAssignment(req.params.id, reqAssignment);

    if (!(assignment instanceof Assignment)) return next(assignment);

    res.status(200).send({ assignment: assignmentView(assignment) });
  }
);

export default assignments;
