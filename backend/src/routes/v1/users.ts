import { Router, Request, Response, NextFunction } from 'express';

import { usersView, userView } from '~/views/users';
import { User, UserDTO } from '~/models/user';
import { Todo } from '~/models/todo';
import { InvalidUserRequestBodyError, UserCreationError } from '~/errors/user';
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
  getUserByUsername
} from '~/controllers/users';
import { FindOptions, WhereOptions, Op } from 'sequelize';
import { getPaginationInfo } from '~/utils/pagination';
import { InvalidRequestBodyError } from '~/errors/common';
import { createTodo, deleteTodo, listTodos } from '~/controllers/todos';
import { todosView, todoView } from '~/views/todos';
import { disciplinesView } from '~/views/disciplines';
import { listDisciplines } from '~/controllers/disciplines';
import { createAssignment, listAssignments } from '~/controllers/assignments';
import { assignmentsView, assignmentView } from '~/views/assignments';
import { Assignment } from '~/models/assignment';

const users = Router();

type ListUsersRequestQuery = {
  page?: string;
  size?: string;
  email?: string;
  username?: string;
};

type ListTodosRequestQuery = {
  page?: string;
  size?: string;
  done?: boolean;
  message?: string;
};

type ListDisciplinesRequestQuery = {
  page?: string;
  size?: string;
  name?: string;
};

type ListAssignmentsRequestQuery = {
  page?: string;
  size?: string;
  name?: string;
};

type AddUserTodoRequestBody = { todo: { done: boolean; message: string } };

type AddAssignmentToDisciplineRequestBody = {
  assignment: { name: string; grade: number };
};

type GetUserRequestParams = { username: string; id: string };

type CreateUserRequestBody = { user: UserDTO };

type UpdateUserRequestBody = { user: UserDTO };
type UpdateUserRequestParams = { id: string };

type DeleteUserRequestParams = { id: string };

users.get(
  '/',
  async (req: Request<{}, {}, {}, ListUsersRequestQuery>, res: Response) => {
    const page = req.query.page;
    const size = req.query.size;
    const email = req.query.email;
    const username = req.query.username;

    const where: WhereOptions = {};

    if (email) where.email = { [Op.like]: '%' + email + '%' };
    if (username) where.username = { [Op.like]: '%' + username + '%' };

    const paginationInfo = getPaginationInfo(
      Number.parseInt(page as string),
      Number.parseInt(size as string)
    );
    const options: FindOptions = {
      where,
      limit: paginationInfo.limit,
      offset: paginationInfo.offset
    };

    const users = await listUsers(options);

    res.status(200).json(usersView(users, paginationInfo));
  }
);

users.get(
  '/:username',
  async (
    req: Request<GetUserRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    res.status(200).json({ user: userView(user) });
  }
);

users.get(
  '/:username/todos',
  async (
    req: Request<GetUserRequestParams, {}, {}, ListTodosRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    const page = req.query.page;
    const size = req.query.size;
    const done = req.query.done;
    const message = req.query.message;

    const where: WhereOptions = {};
    if (done) where['done'] = { [Op.eq]: done };
    if (message) where['message'] = { [Op.like]: '%' + message + '%' };

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

users.post(
  '/:username/todos',
  async (
    req: Request<GetUserRequestParams, {}, AddUserTodoRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    const todo = req.body.todo;

    const invalidRequestBody = new InvalidRequestBodyError(
      'invalid add todo request body',
      []
    );

    if (!todo) {
      invalidRequestBody.fields.push({
        field: 'todo',
        description: "should have an object 'todo'"
      });
      return next(invalidRequestBody);
    }

    const userId = user.id;
    const done = todo.done;
    const message = todo.message;

    if (!userId || !done || !message) {
      if (!userId)
        invalidRequestBody.fields.push({
          field: 'userId',
          description: "the todo object should have an attribute 'userId'"
        });

      if (!done)
        invalidRequestBody.fields.push({
          field: 'done',
          description: "the todo object should have an attribute 'done'"
        });

      if (!message)
        invalidRequestBody.fields.push({
          field: 'message',
          description: "the todo object should have an attribute 'message'"
        });

      return next(invalidRequestBody);
    }

    const todoItem = await createTodo({ ...todo, userId });

    if (!(todoItem instanceof Todo)) return next(todoItem);

    res.status(201).json({ todo: todoView(todoItem) });
  }
);

users.delete(
  '/:username/todos/:id',
  async (
    req: Request<GetUserRequestParams, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    const id = req.params.id;

    const invalidRequestBody = new InvalidRequestBodyError(
      'invalid add todo request body',
      []
    );

    if (!id) {
      invalidRequestBody.fields.push({
        field: 'id',
        description: "should have an object 'id'"
      });
      return next(invalidRequestBody);
    }
    const userId = user.id;

    if (!userId) {
      if (!userId)
        invalidRequestBody.fields.push({
          field: 'userId',
          description: "the todo object should have an attribute 'userId'"
        });
      return next(invalidRequestBody);
    }

    const result = await deleteTodo(id);

    if (!result) return res.status(204).send();

    next(result);
  }
);

users.get(
  '/:username/disciplines',
  async (
    req: Request<GetUserRequestParams, {}, {}, ListDisciplinesRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    const page = req.query.page;
    const size = req.query.size;
    const name = req.query.name;

    const where: WhereOptions = {};
    if (name) where['name'] = { [Op.like]: '%' + name + '%' };
    if (name) where['userId'] = { [Op.eq]: user.id };

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

users.get(
  '/:username/disciplines/:id/assignments',
  async (
    req: Request<GetUserRequestParams, {}, {}, ListAssignmentsRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;
    const disciplineId = req.params.id;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    const page = req.query.page;
    const size = req.query.size;
    const name = req.query.name;

    const where: WhereOptions = {};
    if (name) where['name'] = { [Op.like]: '%' + name + '%' };
    if (name) where['disciplineId'] = { [Op.eq]: disciplineId };

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

users.post(
  '/:username/disciplines/:id/assignments',
  async (
    req: Request<
      GetUserRequestParams,
      {},
      AddAssignmentToDisciplineRequestBody
    >,
    res: Response,
    next: NextFunction
  ) => {
    const username = req.params.username;
    const disciplineId = req.params.id;

    const user = await getUserByUsername(username);

    if (!(user instanceof User)) return next(user);

    const assignment = req.body.assignment;

    const invalidRequestBody = new InvalidRequestBodyError(
      'invalid add assignment request body',
      []
    );

    if (!assignment) {
      invalidRequestBody.fields.push({
        field: 'assignment',
        description: "should have an object 'assignment'"
      });
      return next(invalidRequestBody);
    }
    const name = assignment.name;
    const grade = assignment.grade;

    if (!name || !grade) {
      if (!name)
        invalidRequestBody.fields.push({
          field: 'name',
          description: "the todo object should have an attribute 'name'"
        });

      if (!grade)
        invalidRequestBody.fields.push({
          field: 'grade',
          description: "the todo object should have an attribute 'grade'"
        });

      return next(invalidRequestBody);
    }

    const createdAssignment = await createAssignment({
      name,
      grade,
      disciplineId
    });

    if (!(createdAssignment instanceof Assignment))
      return next(createdAssignment);

    res.status(200).json(assignmentView(createdAssignment));
  }
);

users.post(
  '/',
  async (
    req: Request<{}, {}, CreateUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const reqUser = req.body.user;

    const invalidCreateUserRequest = new InvalidUserRequestBodyError(
      'invalid create user request body',
      []
    );

    if (!reqUser) {
      invalidCreateUserRequest.fields.push({
        field: 'user',
        description: "should have an object 'user'"
      });
      return next(invalidCreateUserRequest);
    }

    const email = reqUser.email;
    const username = reqUser.username;
    const password = reqUser.password;

    if (!email || !password || !username) {
      if (!email)
        invalidCreateUserRequest.fields.push({
          field: 'email',
          description: "the user object should have an attribute 'email'"
        });
      if (!username)
        invalidCreateUserRequest.fields.push({
          field: 'username',
          description: "the user object should have an attribute 'username'"
        });
      if (!password)
        invalidCreateUserRequest.fields.push({
          field: 'password',
          description: "the user object should have an attribute 'password'"
        });

      return next(invalidCreateUserRequest);
    }

    const user = await createUser(reqUser);

    if (!(user instanceof User)) return next(user as UserCreationError);

    res.status(201).json({ user: userView(user) });
  }
);

users.delete(
  '/:id',
  async (
    req: Request<DeleteUserRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    const result = await deleteUser(req.params.id);

    if (!result) {
      return res.status(204).send();
    }

    return next(result);
  }
);

users.patch(
  '/:id',
  async (
    req: Request<UpdateUserRequestParams, {}, UpdateUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const reqUser = req.body.user;

    const invalidUpdateUserRequest = new InvalidUserRequestBodyError(
      'invalid update user request body',
      []
    );

    if (!reqUser) {
      invalidUpdateUserRequest.fields.push({
        field: 'user',
        description: "should have an object 'user'"
      });
      return next(invalidUpdateUserRequest);
    }

    const user = await updateUser(req.params.id, reqUser);

    if (!(user instanceof User)) return next(user);

    res.status(200).send({ user: userView(user) });
  }
);

export default users;
