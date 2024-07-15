import mongoose from "mongoose";
import { ZodError } from "zod";

export interface ValidationError {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

function handleZodError(error: ZodError<any>) {
  const message = JSON.parse(error.message) as ValidationError[];
  console.log(message);
  const errorMessages = message.map((errorMsg) => {
    const fieldName = errorMsg.path[0];
    const errorMessage = errorMsg.message;
    return `${fieldName}: ${errorMessage}`;
  });

  return errorMessages.join(", ");
}

function handleMongoServerError(error: mongoose.mongo.MongoServerError) {
  switch (error.code) {
    case 11000:
      const alreadyExists = Object.keys(error?.keyPattern);
      return {
        status: 400,
        message: `${alreadyExists.join()} already exists`,
      };

    default:
      return {
        status: 500,
        message: "Internal server error",
      };
  }
}

export const errors = {
  zod: handleZodError,
  mongo: handleMongoServerError,
};
