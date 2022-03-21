import { User } from '@prisma/client';
import { Router } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';

import { pwd } from '../passport/jwt.service';
import { prismaService } from '../prisma/prisma.service';
import { validateBody } from '../middleware/validate';

import { ResetPwdDto } from './user.dto';

const router = Router();

router.post(
  'reset-pwd',
  validateBody(ResetPwdDto),
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const newPassword = await pwd.hash(req.body.newPassword);

    const pwdMatch = await pwd.compare(req.body.oldPassword, user.password);
    if (!pwdMatch) return res.sendStatus(httpStatus.UNAUTHORIZED);

    await prismaService.user.update({ data: { password: newPassword }, where: { id: user.id } });
    res.end();
  },
);

router.get('/profile-tmp-not-secure', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

export default router;
