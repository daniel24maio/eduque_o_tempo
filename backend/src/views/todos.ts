import { Todo } from '~/models/todo';
import { Model } from 'sequelize-typescript';
import { PaginationInfo } from '~/utils/pagination';

export interface todoView {
  id: string;
  done: boolean;
  message: string;
}

export interface todosView {
  todos: Array<todoView>;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
}

type todosViewData<M extends Model> = { rows: Array<M>; count: number };

export function todosView(
  data: todosViewData<Todo> | Array<Todo>,
  paginationInfo?: PaginationInfo
): todosView {
  let view: todosView;

  if (paginationInfo && !(data instanceof Array)) {
    view = {
      todos: [],
      page: paginationInfo.page,
      pageSize: paginationInfo.size,
      totalPages: Math.ceil(
        (data as todosViewData<Todo>).count / paginationInfo.limit
      ),
      totalItems: (data as todosViewData<Todo>).count
    };
    (data as todosViewData<Todo>).rows.forEach((todo) => {
      view.todos.push(todoView(todo));
    });
  } else {
    view = {
      todos: []
    };

    const todos: Array<Todo> = data as Array<Todo>;

    todos.forEach((todo) => {
      view.todos.push(todoView(todo));
    });
  }

  return view;
}

export function todoView(todo: Todo): todoView {
  return {
    id: todo.id,
    done: todo.done,
    message: todo.message
  };
}
