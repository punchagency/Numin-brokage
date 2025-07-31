import z, { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { AuthController } from "../controllers/auth.controller";
import { container } from "tsyringe";

type ZodValidationOptions = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validate =
  (schemas: ZodValidationOptions) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as ParamsDictionary;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Record<string, any>;
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: z.treeifyError(err) });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

export const authorize =
  () => (req: Request, res: Response, next: NextFunction) => {
    try {
      const authController = container.resolve(AuthController);
      const user: Record<string, any> = authController.verifyUserToken(
        req,
        res
      );
      req.body.user = user;
      next();
    } catch (err) {
      console.log("err", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
