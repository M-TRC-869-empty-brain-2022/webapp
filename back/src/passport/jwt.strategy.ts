import JwtStrategy from 'passport-jwt';

import { prismaService } from '../prisma/prisma.service';
import { jwtConstants } from '../constants';

const stategyParams = <JwtStrategy.StrategyOptions>{
  jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConstants.secret,
};

export default new JwtStrategy.Strategy(stategyParams, async (payload, done) => {
  const user = await prismaService.user.findUnique({ where: { id: payload.sub } });
  if (!user) return done(undefined, null, { message: 'Invalid Credentials' });

  return done(undefined, user);
});
