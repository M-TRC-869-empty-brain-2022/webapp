import JwtStrategy from 'passport-jwt';
import * as env from 'env-var';

import { prismaService } from '../prisma/prisma.service';

const secret = env.get('JWT_SECRET').required().asString();

const stategyParams = <JwtStrategy.StrategyOptions>{
  jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

export default new JwtStrategy.Strategy(stategyParams, async (payload, done) => {
  const user = await prismaService.user.findUnique({ where: { id: payload.sub } });
  if (!user) return done(undefined, null, { message: 'Invalid Credentials' });

  return done(undefined, user);
});
