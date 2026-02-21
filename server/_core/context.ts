import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // 🔥 Primeiro tenta pegar do middleware do Firebase
    const firebaseUser = (opts.req as any).firebaseUser;

    if (firebaseUser) {
      // Se quiser, pode buscar esse usuário no banco aqui
      user = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
      } as User;
    } else {
      // Fallback para autenticação antiga
      user = await sdk.authenticateRequest(opts.req);
    }

  } catch (error) {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}