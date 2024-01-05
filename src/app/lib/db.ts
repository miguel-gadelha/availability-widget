import { MongoClient, Db } from "mongodb";

export class Database {
  private static instance: Database;
  private connectionString: string;
  private db?: Db;
  private client?: MongoClient;

  private constructor() {
    if (!process.env.MONGODB_CONNECTION_STRING) {
      throw new Error(
        "MONGODB_CONNECTION_STRING is not defined in environment variables."
      );
    }
    this.connectionString = process.env.MONGODB_CONNECTION_STRING;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async connectClient(): Promise<MongoClient> {
    try {
      return await MongoClient.connect(this.connectionString);
    } catch (error) {
      throw new Error(`Failed to connect to MongoDB client: ${error}`);
    }
  }

  public async connect(): Promise<boolean> {
    this.client = await this.connectClient();

    if (this.client) {
      try {
        this.db = this.client.db("sprint_availability");
        return true;
      } catch (error) {
        throw new Error(`Failed to connect to MongoDB database: ${error}`);
      }
    } else {
      throw new Error("Failed to connect to MongoDB client.");
    }
  }

  public getCollection(collectionName: string) {
    if (!this.db) {
      throw new Error("Database is not connected.");
    }
    return this.db.collection(collectionName);
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();

      this.client = undefined;
      this.db = undefined;
    }
  }
}
