import { Todo, TodoDTO } from '~/models/todo';
import {
  TodoCreationError,
  TodoNotFoundError,
  TodoUpdateError
} from '~/errors/todo';

import { FindOptions, ValidationError } from 'sequelize/types';

export async function getTodo(id: string): Promise<Todo | TodoNotFoundError> {
  const todo = await Todo.findByPk(id);

  if (!todo) return new TodoNotFoundError('todo not found');

  return todo;
}

export async function getTodoByPk(
  id: string
): Promise<Todo | TodoNotFoundError> {
  const todo = await Todo.findOne({ where: { id } });

  if (!todo) return new TodoNotFoundError('todo not found');

  return todo;
}

export async function findTodo(
  options: FindOptions
): Promise<Todo | TodoNotFoundError> {
  const todo = await Todo.findOne(options);

  if (!todo) return new TodoNotFoundError('todo not found');

  return todo;
}

export async function listTodos(
  options?: FindOptions
): Promise<{ rows: Array<Todo>; count: number }> {
  const todos = await Todo.findAndCountAll(options);

  return todos;
}

export async function createTodo(
  data: TodoDTO
): Promise<Todo | TodoCreationError> {
  const todo = Todo.build({ ...data });

  try {
    await todo.save();
  } catch (err) {
    const todoCreationError = new TodoCreationError(
      'failed on todo creation',
      []
    );

    const validationError = err as ValidationError;

    validationError.errors.forEach((error) => {
      todoCreationError.fields.push({
        field: error.path as string,
        description: error.message
      });
    });

    return todoCreationError;
  }

  return todo;
}

export async function deleteTodo(
  id: string
): Promise<TodoNotFoundError | void> {
  const todo = await Todo.findByPk(id);

  if (!todo) return new TodoNotFoundError('todo not found');

  await todo.destroy();
}

export async function updateTodo(
  id: string,
  data: TodoDTO
): Promise<TodoNotFoundError | Todo> {
  const todo = await Todo.findByPk(id);

  if (!todo) return new TodoNotFoundError('todo not found');

  const done = data.done;
  const message = data.message;

  if (done !== undefined) todo.done = done;
  if (message) todo.message = message;

  try {
    await todo.save();
  } catch (err) {
    const todoUpdateError = new TodoUpdateError('failed on todo creation', []);

    const validationError = err as ValidationError;

    validationError.errors.forEach((error) => {
      todoUpdateError.fields.push({
        field: error.path as string,
        description: error.message
      });
    });

    return todoUpdateError;
  }

  return todo;
}
