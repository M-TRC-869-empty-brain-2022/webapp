import { User } from '@prisma/client';
import { Request, Response } from 'express';

type CustomCallback<T> = (req: Request, res: Response, body: T, user: User) => void;

export const forward =
  <T>(cb: CustomCallback<T>) =>
  (req: Request, res: Response) =>
    cb(req, res, req.body as T, req.user as User);
