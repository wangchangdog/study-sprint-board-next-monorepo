import { PrismaClient } from "@prisma/client";

/**
 * Prisma クライアントのシングルトン。
 * 開発時の Hot Reload で接続が増えるのを防ぐ。
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
