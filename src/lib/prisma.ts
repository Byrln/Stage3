import {PrismaClient} from "@prisma/client";
import {withAccelerate} from "@prisma/extension-accelerate";

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(withAccelerate());
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClientSingleton;
};

const globalWithPrisma = globalThis as GlobalWithPrisma;

const prisma = globalWithPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma.prisma = prisma;
}

export {prisma};
