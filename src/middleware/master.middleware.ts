import type { NextFunction, Request, RequestHandler, Response } from "express";
import ApiResponse from "../lib/api-response";
import { z } from "zod";
import { JwtService } from "../services/jwt.service";
import { addToObject } from "../lib/utils";
import { Roles } from "../lib/types";

const masterProtectionValidation = z.object({
  userId: z.string(),
  role: z.string(),
});

const protection = (role: Roles | "*") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers?.authorization?.split(" ")[1];

    if (!authToken) {
      res.status(403).send(new ApiResponse(403, "Access denied"));
      return;
    }

    const decodedToken = JwtService.decodeToken(authToken);

    let id: string | boolean;
    let roleType: string | boolean;
    try {
      const { userId, role } = masterProtectionValidation.parse(decodedToken);

      id = userId;
      roleType = role;
    } catch (error) {
      id = false;
      roleType = false;
    }

    if (!id) {
      res.status(403).send(new ApiResponse(403, "Access denied"));
      return;
    }

    if (roleType === "Master") {
      addToObject(res, "userId", id);
      addToObject(res, "role", roleType || "");
      next();
      return;
    }

    if (role !== roleType) {
      res.status(403).send(new ApiResponse(403, "Access denied"));
      return;
    }

    addToObject(res, "userId", id);
    addToObject(res, "role", roleType || "");
    next();
  };
};

export default protection;
