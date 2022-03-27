import { Router } from 'express';
import passport from 'passport';

import { forward } from '../../utils/request';
import { validateBody } from '../../middleware/validate';
import { prismaService } from '../../prisma/prisma.service';

import { select } from '../todolist.controller';

import { SearchTodoListDto } from './search.dto';

const router = Router();

router.post(
  '/',
  validateBody(SearchTodoListDto),
  passport.authenticate('jwt', { session: false }),
  forward<SearchTodoListDto>(async (req, res, body, user) => {
    const lists = await prismaService.todoList.findMany({
      where: { shared: true, name: { contains: body.name } },
      select,
    });

    res.json(lists);
  }),
);

export default router;
