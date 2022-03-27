import { Router } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';

import { prismaService } from '../prisma/prisma.service';
import { forward } from '../utils/request';
import { validateBody } from '../middleware/validate';

import { AdminUpdateUserDto } from './admin.dto';

const router = Router();

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  forward(async (req, res, body, user) => {
    if (user.role !== 'ADMIN') return res.sendStatus(httpStatus.FORBIDDEN);

    const users = await prismaService.user.findMany({
      select: { id: true, username: true, role: true, profilePicture: true },
    });
    res.json(users);
  }),
);

router.delete(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  forward(async (req, res, body, user) => {
    if (user.role !== 'ADMIN') return res.sendStatus(httpStatus.FORBIDDEN);

    const { id } = req.params;

    await prismaService.user.delete({ where: { id } });
    res.end();
  }),
);

router.post(
  '/user/:id',
  validateBody(AdminUpdateUserDto),
  passport.authenticate('jwt', { session: false }),
  forward<AdminUpdateUserDto>(async (req, res, body, user) => {
    if (user.role !== 'ADMIN') return res.sendStatus(httpStatus.FORBIDDEN);

    const { id } = req.params;

    await prismaService.user.update({ where: { id }, data: { role: body.role } });
    res.end();
  }),
);

export default router;
