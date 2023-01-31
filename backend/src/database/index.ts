import config from '~/config/database';

import { seed as seedUsers } from '~/database/users';
import { seed as seedTodos } from '~/database/todo';
import { seed as seedDisciplines } from '~/database/discipline';
import { seed as seedAssignments } from '~/database/assignment';

import { Sequelize } from 'sequelize-typescript';

import { User } from '~/models/user';
import { Todo } from '~/models/todo';
import { Discipline } from '~/models/discipline';
import { Assignment } from '~/models/assignment';

const sequelize = new Sequelize({
  ...config,
  models: [User, Todo, Discipline, Assignment]
});

interface Database {
  seed: () => Promise<void>;
  sync: (foce: boolean) => Promise<void>;
  close: () => Promise<void>;
}

const database: Database = {
  seed: async () => {
    await seedUsers();
    await seedTodos();
    await seedDisciplines();
    await seedAssignments();
  },
  sync: async (force: boolean) => {
    await sequelize.sync({ force });
    sequelize.addModels([User, Todo, Discipline, Assignment]);
  },
  close: async () => {
    await sequelize.close();
  }
};

export default database;

export { Sequelize, sequelize };
