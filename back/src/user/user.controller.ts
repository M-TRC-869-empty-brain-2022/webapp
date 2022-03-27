import { Router } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';

import { pwd } from '../passport/jwt.service';
import { prismaService } from '../prisma/prisma.service';
import { validateBody } from '../middleware/validate';
import { forward } from '../utils/request';

import { ResetPwdDto } from './user.dto';

const router = Router();

router.post(
  '/reset-pwd',
  validateBody(ResetPwdDto),
  passport.authenticate('jwt', { session: false }),
  forward(async (req, res, body, user) => {
    const newPassword = await pwd.hash(req.body.newPassword);

    const pwdMatch = await pwd.compare(req.body.oldPassword, user.password);
    if (!pwdMatch) return res.sendStatus(httpStatus.UNAUTHORIZED);

    await prismaService.user.update({ data: { password: newPassword }, where: { id: user.id } });
    res.end();
  }),
);

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  forward((req, res, body, { id, username, role }) => {
    res.json({ id, username, role });
  }),
);

export default router;
