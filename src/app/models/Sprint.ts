import { ObjectId } from "mongodb";
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
      name: sprint.name,
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
    if (await this.isNameExists(teamId, sprint.name)) {
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

  protected static async findSprints(teamId: string, query?: object) {
    if (!teamId) {
      return;
    }

    const db = Database.getInstance();
    let isConnected = false;

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    let result;

    if (query) {
      result = await db
        .getCollection("sprints")
        .findOne({ _id: new ObjectId(teamId), ...{ query } });
    } else {
      result = await db.getCollection("sprints").find({ teamId }).toArray();
    }

    await db.close();

    return result;
  }

  public static async findByName(teamId: string, name: string) {
    return await this.findSprints(teamId, { name: name });
  }

  public static async findByTeamId(teamId: string) {
    return await this.findSprints(teamId);
  }
}
