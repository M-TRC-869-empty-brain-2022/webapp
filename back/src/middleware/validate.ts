import { transformAndValidate } from 'class-transformer-validator';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';

export const validateBody = (dto: any) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.body = await transformAndValidate(dto, req.body);
    next();
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).send(e);
  }
};
