import { Prisma } from '@prisma/client';
import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as env from 'env-var';
import httpStatus from 'http-status-codes';

import { prismaService } from '../prisma/prisma.service';
import { validateBody } from '../middleware/validate';

import { LoginDto, RegisterDto } from './auth.dto';

const router = Router();
const secret = env.get('JWT_SECRET').required().asString();

router.post('/register', validateBody(RegisterDto), async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await prismaService.user.create({
      data: { email: req.body.email, password },
    });

    res.json({
      access_token: jwt.sign({ email: user.email, sub: user.id }, secret, { expiresIn: '1d' }),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.sendStatus(409);
    }
    return res.sendStatus(500);
  }
});

router.post('/login', validateBody(LoginDto), async (req, res) => {
  const user = await prismaService.user.findUnique({ where: { email: req.body.email } });
  if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

  const pwdMatch = await bcrypt.compare(req.body.password, user.password);
  if (!pwdMatch) return res.sendStatus(httpStatus.UNAUTHORIZED);

  res.json({
    access_token: jwt.sign({ email: user.email, sub: user.id }, secret, { expiresIn: '1d' }),
  });
});

export default router;
