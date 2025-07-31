import { injectable } from "tsyringe";
import AuthService from "../services/auth.service";
import { LoginParams } from "../interfaces/auth.interface";
import { Request, Response } from "express";

@injectable()
export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const { publicKey, privateKey } = req.body as LoginParams;
    if (!publicKey || !privateKey) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = await this.authService.login(publicKey, privateKey);
    res.json({ token });
  }

  verifyUserToken(req: Request, res: Response) {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      return this.authService.verifyUserToken(bearerToken);
    } catch (err) {
      return res.status(401).json({ message: err });
    }
  }
}
