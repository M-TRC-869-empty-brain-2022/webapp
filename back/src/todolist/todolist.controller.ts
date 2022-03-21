import { Router } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';

import { prismaService } from '../prisma/prisma.service';
import { validateBody } from '../middleware/validate';
import { forward } from '../utils/request';

import { CreateTodoListDto, UpdateTodoListDto } from './todolist.dto';

const router = Router();
const select = {
  id: true,
  description: true,
  name: true,
  shared: true,
  User: { select: { username: true } },
  tasks: true,
} as const;

router.get(
  '',
  passport.authenticate('jwt', { session: false }),
  forward(async (req, res, body, user) => {
    const lists = await prismaService.todoList.findMany({ where: { userId: user.id }, select });

    res.json(lists);
  }),
);

router.get(
  ':id',
  passport.authenticate('jwt', { session: false }),
  forward(async (req, res, body, user) => {
    const { id } = req.params;
    const maybeList = await prismaService.todoList.findUnique({ where: { id }, select: { ...select, userId: true } });

    if (!maybeList) return res.sendStatus(httpStatus.NOT_FOUND);

    const { userId, ...list } = maybeList;

    // doesn't belong to you, only allow if shared
    if (userId !== user.id && !list.shared) return res.sendStatus(httpStatus.FORBIDDEN);

    res.json(list);
  }),
);

router.post(
  '',
  validateBody(CreateTodoListDto),
  passport.authenticate('jwt', { session: false }),
  forward<CreateTodoListDto>(async (req, res, body, user) => {
    const list = await prismaService.todoList.create({
      data: { description: body.description, name: body.name, userId: user.id },
      select,
    });

    res.json(list);
  }),
);

router.put(
  ':id',
  validateBody(UpdateTodoListDto),
  passport.authenticate('jwt', { session: false }),
  forward<UpdateTodoListDto>(async (req, res, body, user) => {
    const { id } = req.params;
    const list = await prismaService.todoList.findUnique({ where: { id } });

    if (!list) return res.sendStatus(httpStatus.NOT_FOUND);
    if (list.userId !== user.id) return res.sendStatus(httpStatus.FORBIDDEN);

    const updated = await prismaService.todoList.update({
      where: { id },
      data: { description: body.description, name: body.name, shared: body.shared },
      select,
    });

    res.json(updated);
  }),
);

router.delete(
  ':id',
  passport.authenticate('jwt', { session: false }),
  forward(async (req, res, body, user) => {
    const { id } = req.params;
    const list = await prismaService.todoList.findUnique({ where: { id } });

    if (!list) return res.sendStatus(httpStatus.NOT_FOUND);
    if (list.userId !== user.id) return res.sendStatus(httpStatus.FORBIDDEN);

    await prismaService.todoList.delete({ where: { id } });

    res.end();
  }),
);

export default router;
