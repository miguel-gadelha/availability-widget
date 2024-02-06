import { Database } from "../lib/db";
import { Team } from "./Team";
import { Sprint } from "@/types";

export class SprintHandler {
  private calculateAvailability(
    members: Sprint["members"],
    length: number
  ): number {
    const totalDaysOut = members.reduce(
      (total, member) => total + member.days,
      0
    );

    const totalSprintDays = length * members.length;
    const actualSprintDays = totalSprintDays - totalDaysOut;

    return (actualSprintDays * 100) / totalSprintDays;
  }

  private async isNameExists(teamId: string, name: string): Promise<boolean> {
    return Boolean(await SprintHandler.findByName(teamId, name));
  }

  private async save(teamId: string, sprint: Sprint, availability: string) {
    const db = Database.getInstance();
    let isConnected = false;

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    const result = await db.getCollection("sprints").insertOne({
      name: encodeURI(sprint.name),
      length: sprint.length,
      members: sprint.members,
      availability: availability,
      teamId,
    });

    await db.close();

    return result;
  }

  public async edit(teamId: string, name: string, settings: Partial<Sprint>) {
    const db = Database.getInstance();
    let isConnected = false;
    let availability;

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    if (settings.members && settings.length) {
      availability = this.calculateAvailability(
        settings.members,
        settings.length
      );
    }

    const result = await db.getCollection("sprints").updateOne(
      { name, teamId },
      {
        settings,
        availability,
      }
    );

    await db.close();

    return result;
  }

  public async create(teamId: string, sprint: Sprint) {
    const alreadyExists = await this.isNameExists(
      teamId,
      encodeURI(sprint.name)
    );

    if (alreadyExists) {
      throw new Error("Name already exists in database");
    }
    const team = await Team.findById(teamId);

    if (!team) {
      throw new Error("Team not found in database");
    }

    const availability = this.calculateAvailability(
      sprint.members,
      sprint.length
    );

    await this.save(teamId, sprint, availability.toFixed(2));
  }

  public async delete(teamId: string, name: string) {
    const alreadyExists = await this.isNameExists(teamId, name);

    if (!alreadyExists) {
      throw new Error("Sprint not found");
    }

    const db = Database.getInstance();
    const isConnected = await db.connect();

    if (!isConnected || !db) {
      throw new Error("Failed to connect to database");
    }

    const result = await db
      .getCollection("sprints")
      .deleteOne({ teamId, name });

    await db.close();

    return result;
  }

  protected static async findSprints(
    teamId: string,
    query?: object,
    skip?: number,
    limit?: number
  ) {
    if (!teamId) {
      return;
    }

    const db = Database.getInstance();
    const isConnected = await db.connect();

    if (!isConnected || !db) {
      throw new Error("Failed to connect to database");
    }

    let result;

    if (query) {
      result = await db.getCollection("sprints").findOne({ teamId, ...query });
    } else {
      result = await db
        .getCollection("sprints")
        .find({ teamId })
        .sort({ _id: -1 })
        .skip(skip || 0)
        .limit(limit || 0)
        .toArray();
    }

    await db.close();

    return result;
  }

  public static async findByName(teamId: string, name: string) {
    return await this.findSprints(teamId, { name: name });
  }

  public static async findByTeamId(
    teamId: string,
    skip?: number,
    limit?: number
  ) {
    return await this.findSprints(teamId, undefined, skip, limit);
  }
}
