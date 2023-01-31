import { Router, Request, Response, NextFunction } from 'express';

import { FindOptions, Op, WhereOptions } from 'sequelize';

import { getPaginationInfo } from '~/utils/pagination';

import { Todo, TodoDTO } from '~/models/todo';
import {
  createTodo,
  deleteTodo,
  getTodoByPk,
  listTodos,
  updateTodo
} from '~/controllers/todos';
import { todosView, todoView } from '~/views/todos';

import { TodoCreationError, InvalidTodoRequestBodyError } from '~/errors/todo';

const todos = Router();

type ListTodosRequestQuery = {
  page?: string;
  size?: string;
  done?: boolean;
  message?: string;
};

type CreateTodoRequestBody = { todo: TodoDTO };
type DeleteTodoRequestParams = { id: string };

type GetTodoRequestParms = { id: string };

type UpdateTodoRequestBody = { todo: TodoDTO };
type UpdateTodoRequestParams = { id: string };

todos.get(
  '/',
  async (req: Request<{}, {}, {}, ListTodosRequestQuery>, res: Response) => {
    const page = req.query.page;
    const size = req.query.size;
    const done = req.query.done;
    const message = req.query.message;

    const where: WhereOptions = {};

    if (done) where.name = { [Op.eq]: done };
    if (message) where.message = { [Op.like]: '%' + message + '%' };

    const paginationInfo = getPaginationInfo(
      Number.parseInt(page as string),
      Number.parseInt(size as string)
    );
    const options: FindOptions = {
      where,
      limit: paginationInfo.limit,
      offset: paginationInfo.offset
    };

    const todos = await listTodos(options);

    res.status(200).json(todosView(todos, paginationInfo));
  }
);

todos.get(
  '/:id',
  async (
    req: Request<GetTodoRequestParms>,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const todo = await getTodoByPk(id);

    if (!(todo instanceof Todo)) return next(todo);

    res.status(200).json({ todo: todoView(todo) });
  }
);

todos.post(
  '/',
  async (
    req: Request<{}, {}, CreateTodoRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const reqTodo = req.body.todo;

    const invalidCreateTodoRequest = new InvalidTodoRequestBodyError(
      'invalid create todo request body',
      []
    );

    if (!reqTodo) {
      invalidCreateTodoRequest.fields.push({
        field: 'todo',
        description: "should have an object 'todo'"
      });
      return next(invalidCreateTodoRequest);
    }

    const done = reqTodo.done;
    const message = reqTodo.message;

    if (!done || !message) {
      if (!done)
        invalidCreateTodoRequest.fields.push({
          field: 'done',
          description: "the todo object should have an attribute 'done'"
        });
      if (!message)
        invalidCreateTodoRequest.fields.push({
          field: 'message',
          description: "the todo object should have an attribute 'message'"
        });
      return next(invalidCreateTodoRequest);
    }

    reqTodo.userId = req.user?.id as string;

    const todo = await createTodo(reqTodo);

    if (!(todo instanceof Todo)) return next(todo as TodoCreationError);

    res.status(201).json({ todo: todoView(todo) });
  }
);

todos.delete(
  '/:id',
  async (
    req: Request<DeleteTodoRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    const result = await deleteTodo(req.params.id);

    if (!result) {
      return res.status(204).send();
    }

    return next(result);
  }
);

todos.patch(
  '/:id',
  async (
    req: Request<UpdateTodoRequestParams, {}, UpdateTodoRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const reqTodo = req.body.todo;

    const invalidUpdateTodoRequestBody = new InvalidTodoRequestBodyError(
      'invalid update todo request body',
      []
    );

    if (!reqTodo) {
      invalidUpdateTodoRequestBody.fields.push({
        field: 'todo',
        description: "should have an object 'todo'"
      });
      return next(invalidUpdateTodoRequestBody);
    }

    const todo = await updateTodo(req.params.id, reqTodo);

    if (!(todo instanceof Todo)) return next(todo);

    res.status(200).send({ todo: todoView(todo) });
  }
);

export default todos;
