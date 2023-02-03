import { Discipline } from '~/models/discipline';

import { users } from '~/database/users';

let disciplines: Array<Discipline> = [];

async function seed() {
  disciplines = [];

  // disciplines.push(
  //   Discipline.build({
  //     name: 'math',
  //     userId: users[0].id
  //   })
  // );

  // disciplines.push(
  //   Discipline.build({
  //     name: 'science',
  //     userId: users[0].id
  //   })
  // );

  // await disciplines[0].save();
  // await disciplines[1].save();
}

export { seed, disciplines };
