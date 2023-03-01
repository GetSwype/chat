import { PrismaClient } from '@prisma/client'

const Storage = {
  instance: new PrismaClient(),
};

export type IDBClient = typeof Storage;

Object.freeze(Storage);

export default Storage;