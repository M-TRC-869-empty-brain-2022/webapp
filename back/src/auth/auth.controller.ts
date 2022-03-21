import { Prisma } from '@prisma/client';
import { Router } from 'express';
import httpStatus from 'http-status-codes';

import { prismaService } from '../prisma/prisma.service';
import { validateBody } from '../middleware/validate';
import { pwd, sign } from '../passport/jwt.service';

import { LoginDto, RegisterDto } from './auth.dto';

const router = Router();

router.post('/register', validateBody(RegisterDto), async (req, res) => {
  const password = await pwd.hash(req.body.password);

  try {
    const user = await prismaService.user.create({ data: { email: req.body.email, password } });

    res.json({ access_token: sign(user) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return res.sendStatus(409);
    return res.sendStatus(500);
  }
});

router.post('/login', validateBody(LoginDto), async (req, res) => {
  const user = await prismaService.user.findUnique({ where: { email: req.body.email } });
  if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

  const pwdMatch = await pwd.compare(req.body.password, user.password);
  if (!pwdMatch) return res.sendStatus(httpStatus.UNAUTHORIZED);

  res.json({ access_token: sign(user) });
});

export default router;
