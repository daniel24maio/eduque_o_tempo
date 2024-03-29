import { createServer } from '~/server';
import config from '~/config';

import database from '~/database';
(async () => {
  await database.sync(true);
  await database.seed();
})();

const server = createServer();

server.listen(config.env.port, () =>
  console.log(`[eduque-o-tempo]: listening on port ${config.env.port}`)
);
