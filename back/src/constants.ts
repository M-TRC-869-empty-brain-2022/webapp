import * as env from 'env-var';

export const jwtConstants = {
  secret: env.get('JWT_SECRET').required().asString(),
};

export const appConstants = {
  PORT: env.get('PORT').asPortNumber() || 3000,
  FRONT_URL: env.get('FRONT_URL').asString() || 'http://localhost:8080',
};
