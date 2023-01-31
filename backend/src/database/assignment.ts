import { Assignment } from '~/models/assignment';

import { disciplines } from '~/database/discipline';

let assignments: Array<Assignment> = [];

async function seed() {
  assignments = [];

  assignments.push(
    Assignment.build({
      name: 'math',
      grade: 10.0,
      disciplineId: disciplines[0].id
    })
  );

  assignments.push(
    Assignment.build({
      name: 'science',
      grade: 10.0,
      disciplineId: disciplines[0].id
    })
  );

  await assignments[0].save();
  await assignments[1].save();
}

export { seed, assignments };
