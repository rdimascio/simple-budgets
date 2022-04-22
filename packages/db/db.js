import client from "@prisma/client";
const { PrismaClient } = client;
const db = new PrismaClient();

export default db;
