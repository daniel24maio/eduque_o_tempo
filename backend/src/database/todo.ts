import { Todo } from '~/models/todo';

import { users } from '~/database/users';

let todos: Array<Todo> = [];

async function seed() {
  todos = [];
  /*
  todos.push(
    Todo.build({
      done: false,
      message: 'do something',
      userId: users[0].id
    })
  );

  todos.push(
    Todo.build({
      done: true,
      message: 'do something',
      userId: users[0].id
    })
  );

  await todos[0].save();
  await todos[1].save();
  */
}

export { seed, todos };
