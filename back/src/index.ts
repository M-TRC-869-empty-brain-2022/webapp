import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import * as env from 'env-var';
import 'dotenv/config';

import authRoutes from './auth/auth.controller';
import userRoutes from './user/user.controller';
import JWTLoginStrategy from './passport/jwt.strategy';

const PORT = env.get('PORT').asPortNumber() || 3000;
const FRONT_URL = env.get('FRONT_URL').asString() || 'http://localhost:8080';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: FRONT_URL, credentials: true }));
app.use(passport.initialize());
passport.use(JWTLoginStrategy);

app.get('/health', (_, res) => res.json({ status: 'healthy', port: PORT }));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
