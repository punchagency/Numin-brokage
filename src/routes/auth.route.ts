import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginSchema } from "../interfaces/auth.interface";

const router = Router();
const authController = container.resolve(AuthController);

router.post("/login", validate(loginSchema), async (req, res) => {
  const token = await authController.login(req, res);
  res.json({ token });
});

export default router;
