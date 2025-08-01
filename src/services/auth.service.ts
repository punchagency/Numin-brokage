import { injectable } from "tsyringe";
import { generateToken, verifyToken } from "../utils/jwt";

@injectable()
class AuthService {
  constructor() {}

  async login(publicKey: string, privateKey: string) {
    return generateToken({
      publicKey,
      privateKey,
    });
  }

  verifyUserToken(bearerToken: string) {
    const token = this.extractBearerToken(bearerToken);
    if (!token) {
      throw "Invalid token";
    }

    return verifyToken(token);
  }

  private extractBearerToken(authHeader: string | undefined): string | null {
    if (!authHeader || typeof authHeader !== "string") return null;

    const prefix = "Bearer ";
    if (authHeader.startsWith(prefix)) {
      return authHeader.slice(prefix.length).trim(); // Removes 'Bearer ' and extra spaces
    }

    return null;
  }
}

export default AuthService;
