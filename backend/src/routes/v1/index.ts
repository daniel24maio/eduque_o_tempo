import { Router, Request, Response } from 'express';

import users from '~/routes/v1/users';
import todos from '~/routes/v1/todos';
import disciplines from '~/routes/v1/disciplines';
import assignments from '~/routes/v1/assignments';

const v1 = Router();

v1.use('/users', users);
v1.use('/todos', todos);
v1.use('/disciplines', disciplines);
v1.use('/assignments', assignments);

v1.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Eduque o Tempo',
    version: 1,
    resources: ['/users', '/todos', '/disciplines', '/assignments']
  });
});

export default v1;
