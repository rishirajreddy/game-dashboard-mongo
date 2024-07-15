import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errors } from "../services/error.service";
import ApiResponse from "../lib/api-response";
import mongoose from "mongoose";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  if (err instanceof ZodError) {
    const response = errors.zod(err);

    res.status(422).send(new ApiResponse(422, response, null));
    return;
  }

  if (err instanceof mongoose.mongo.MongoServerError) {
    const response = errors.mongo(err);

    res
      .status(response.status)
      .json(new ApiResponse(response.status, response.message, null));

    return;
  }

  res.status(500).json({
    message: err.message,
    cause: err.cause,
    stack: err.stack,
  });
}
export default errorHandler;
