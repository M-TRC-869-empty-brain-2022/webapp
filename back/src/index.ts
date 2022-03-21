import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import 'dotenv/config';

import { appConstants } from './constants';
import authRoutes from './auth/auth.controller';
import userRoutes from './user/user.controller';
import JWTLoginStrategy from './passport/jwt.strategy';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: appConstants.FRONT_URL, credentials: true }));
app.use(passport.initialize());
passport.use(JWTLoginStrategy);

app.get('/health', (_, res) => res.json({ status: 'healthy' }));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(appConstants.PORT, () => console.log(`Server is running on port ${appConstants.PORT}`));
