import { Assignment } from '~/models/assignment';
import { Model } from 'sequelize-typescript';
import { PaginationInfo } from '~/utils/pagination';

export interface AssignmentView {
  id: string;
  name: string;
  grade: number;
  disciplineId: string;
}

export interface AssignmentsView {
  assignments: Array<AssignmentView>;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
}

type assignmentsViewData<M extends Model> = { rows: Array<M>; count: number };

export function assignmentsView(
  data: assignmentsViewData<Assignment> | Array<Assignment>,
  paginationInfo?: PaginationInfo
): AssignmentsView {
  let view: AssignmentsView;

  if (paginationInfo && !(data instanceof Array)) {
    view = {
      assignments: [],
      page: paginationInfo.page,
      pageSize: paginationInfo.size,
      totalPages: Math.ceil(
        (data as assignmentsViewData<Assignment>).count / paginationInfo.limit
      ),
      totalItems: (data as assignmentsViewData<Assignment>).count
    };
    (data as assignmentsViewData<Assignment>).rows.forEach((assignment) => {
      view.assignments.push(assignmentView(assignment));
    });
  } else {
    view = {
      assignments: []
    };

    const assignments: Array<Assignment> = data as Array<Assignment>;

    assignments.forEach((assignment) => {
      view.assignments.push(assignmentView(assignment));
    });
  }

  return view;
}

export function assignmentView(assignment: Assignment): AssignmentView {
  return {
    id: assignment.id,
    name: assignment.name,
    grade: assignment.grade,
    disciplineId: assignment.disciplineId
  };
}
