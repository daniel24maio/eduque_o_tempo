import { Discipline } from '~/models/discipline';
import { Model } from 'sequelize-typescript';
import { PaginationInfo } from '~/utils/pagination';

export interface DisciplineView {
  id: string;
  name: string;
  userId: string;
}

export interface disciplinesView {
  disciplines: Array<DisciplineView>;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
}

type disciplinesViewData<M extends Model> = { rows: Array<M>; count: number };

export function disciplinesView(
  data: disciplinesViewData<Discipline> | Array<Discipline>,
  paginationInfo?: PaginationInfo
): disciplinesView {
  let view: disciplinesView;

  if (paginationInfo && !(data instanceof Array)) {
    view = {
      disciplines: [],
      page: paginationInfo.page,
      pageSize: paginationInfo.size,
      totalPages: Math.ceil(
        (data as disciplinesViewData<Discipline>).count / paginationInfo.limit
      ),
      totalItems: (data as disciplinesViewData<Discipline>).count
    };
    (data as disciplinesViewData<Discipline>).rows.forEach((discipline) => {
      view.disciplines.push(disciplineView(discipline));
    });
  } else {
    view = {
      disciplines: []
    };

    const disciplines: Array<Discipline> = data as Array<Discipline>;

    disciplines.forEach((discipline) => {
      view.disciplines.push(disciplineView(discipline));
    });
  }

  return view;
}

export function disciplineView(discipline: Discipline): DisciplineView {
  return {
    id: discipline.id,
    name: discipline.name,
    userId: discipline.userId
  };
}
