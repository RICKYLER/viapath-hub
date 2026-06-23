import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

export function getPrisma(databaseUrl: string): PrismaClient {
  if (!prismaInstance) {
    const globalAny = globalThis as any;
    globalAny.process = globalAny.process || {};
    globalAny.process.env = globalAny.process.env || {};
    globalAny.process.env.DATABASE_URL = databaseUrl;
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}
