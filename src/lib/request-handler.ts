import type { NextFunction, Request, Response } from "express";

type Controller = (req: Request, res: Response, next: NextFunction) => void;

const requesHandler = (controller: Controller) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch((err) => next(err));
  };
};

export default requesHandler;
