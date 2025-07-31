import z from "zod";

export interface LoginParams {
  publicKey: string;
  privateKey: string;
}

export const loginSchema = {
  body: z.object({
    publicKey: z.string(),
    privateKey: z.string(),
  }),
};
