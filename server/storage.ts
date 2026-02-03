
import { db } from "./db";
import { logs, type InsertLog, type Log } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createLog(log: InsertLog): Promise<Log>;
  getLogs(limit?: number): Promise<Log[]>;
}

export class DatabaseStorage implements IStorage {
  async createLog(log: InsertLog): Promise<Log> {
    const [newLog] = await db.insert(logs).values(log).returning();
    return newLog;
  }

  async getLogs(limit = 100): Promise<Log[]> {
    return await db.select().from(logs).orderBy(desc(logs.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
