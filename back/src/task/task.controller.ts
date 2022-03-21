import { Router } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';

import { prismaService } from '../prisma/prisma.service';
import { validateBody } from '../middleware/validate';
import { forward } from '../utils/request';

import { CreateTaskDto, UpdateTaskDto } from './task.dto';

const router = Router();
const select = { id: true, name: true, progress: true } as const;

router.post(
  ':todolistId',
  validateBody(CreateTaskDto),
  passport.authenticate('jwt', { session: false }),
  forward<CreateTaskDto>(async (req, res, body, user) => {
    const { todolistId } = req.params;
    const list = await prismaService.todoList.findUnique({
      where: { id: todolistId },
      select: { userId: true, id: true },
    });

    if (!list) return res.sendStatus(httpStatus.NOT_FOUND);
    if (list.userId !== user.id) return res.sendStatus(httpStatus.FORBIDDEN);

    const task = await prismaService.task.create({ data: { name: body.name, todoListId: list.id }, select });

    res.json(task);
  }),
);

router.put(
  ':id',
  validateBody(UpdateTaskDto),
  passport.authenticate('jwt', { session: false }),
  forward<UpdateTaskDto>(async (req, res, body, user) => {
    const { id } = req.params;

    const task = await prismaService.task.findUnique({
      where: { id },
      select: { todoList: { select: { user: { select: { id: true } } } } },
    });

    if (!task) return res.sendStatus(httpStatus.NOT_FOUND);
    if (task.todoList.user.id !== user.id) return res.sendStatus(httpStatus.FORBIDDEN);

    const updated = await prismaService.task.update({
      where: { id },
      data: { name: body.name, progress: body.progress },
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
    const task = await prismaService.task.findUnique({
      where: { id },
      select: { todoList: { select: { user: { select: { id: true } } } } },
    });

    if (!task) return res.sendStatus(httpStatus.NOT_FOUND);
    if (task.todoList.user.id !== user.id) return res.sendStatus(httpStatus.FORBIDDEN);

    await prismaService.task.delete({ where: { id } });

    res.end();
  }),
);

export default router;
