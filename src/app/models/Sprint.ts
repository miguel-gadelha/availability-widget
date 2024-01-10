import { Database } from "../lib/db";

interface Sprint {
  name: string;
  length: number;
  members: [{ name: string; daysOut: number }];
}

export class SprintHandler {
  private calculateAvailability(
    members: Sprint["members"],
    length: number
  ): number {
    const totalDaysOut = members.reduce(
      (total, member) => total + member.daysOut,
      0
    );

    return (length * members.length) / (length * members.length - totalDaysOut);
  }

  private async isNameExists(name: string): Promise<boolean> {
    return !!SprintHandler.findByName(name);
  }

  private async save(sprint: Sprint, availlability: number) {
    const db = Database.getInstance();
    let isConnected = false;

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    const result = await db.getCollection("sprints").insertOne({
      name: sprint.name,
      length: sprint.length,
      members: sprint.members,
      availlability: availlability,
    });

    await db.close();

    return result;
  }

  public async edit(name: string, settings: Partial<Sprint>) {
    const db = Database.getInstance();
    let isConnected = false;
    let availlability;

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    if (settings.members && settings.length) {
      availlability = this.calculateAvailability(
        settings.members,
        settings.length
      );
    }

    const result = await db.getCollection("sprints").updateOne(
      { name },
      {
        settings,
        availlability,
      }
    );

    await db.close();

    return result;
  }

  public async create(sprint: Sprint) {
    if (await this.isNameExists(sprint.name)) {
      throw new Error("Name already exists in database");
    }

    const availlability = this.calculateAvailability(
      sprint.members,
      sprint.length
    );

    await this.save(sprint, availlability);
  }

  public static async findByName(name: string) {
    const db = Database.getInstance();
    let isConnected = false;

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    const sprint = await db.getCollection("sprints").findOne({ name });

    await db.close();

    return sprint;
  }
}
