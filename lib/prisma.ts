//import { PrismaClient } from "../app/generated/prisma/client"; // point to client.ts
//import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../app/generated/prisma/client";



declare global {
  // Prevent multiple instances of Prisma Client in development
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
