import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { jwtConstants } from '../constants';

export const sign = ({ username, id }: User) =>
  jwt.sign({ username, sub: id }, jwtConstants.secret, { expiresIn: '1d' });

export const pwd = {
  hash: (pwd: string) => bcrypt.hash(pwd, 10),
  compare: (pwd: string, hash: string) => bcrypt.compare(pwd, hash),
};
