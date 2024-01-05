import { hash, compare } from "bcrypt";
import { Database } from "../lib/db";
import Validator from "../lib/validator";

export class Team {
  name: string;
  password: string;
  email: string;
  teamMembers: string[];

  constructor(
    name: string,
    password: string,
    email: string,
    teamMembers: string[]
  ) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.teamMembers = teamMembers;

    if (!process.env.SALTROUNDS) {
      throw new Error("SALTROUNDS is not defined in environment variables.");
    }
  }

  public async save() {
    const db = Database.getInstance();
    let isConnected = false;

    if (this.teamMembers.length < 1) {
      throw new Error(`Need at least one team member`);
    }

    if (!Validator.password(this.password)) {
      throw new Error(`Invalid Password`);
    }

    try {
      isConnected = await db.connect();
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error}`);
    }

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    let emailNotUnique;
    try {
      emailNotUnique = await db
        .getCollection("team")
        .findOne({ email: this.email });
    } catch (error) {
      throw new Error(`Failed to search emails: ${error}`);
    }

    if (emailNotUnique) {
      throw new Error("Email already exists");
    }

    try {
      const hashedPassword = await hash(
        this.password,
        process.env.SALTROUNDS as string
      );
      this.password = hashedPassword;

      const result = await db.getCollection("team").insertOne({
        name: this.name,
        email: this.email,
        password: this.password,
        teamMembers: this.teamMembers,
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to insert team: ${error}`);
    } finally {
      try {
        await db.close();
      } catch (error) {
        throw new Error(`Failed to close to database: ${error}`);
      }
    }
  }

  static async findByEmail(email: string) {
    if (!Validator.email(email)) {
      throw new Error("Invalid email");
    }

    const db = Database.getInstance();
    let isConnected = false;

    try {
      isConnected = await db.connect();
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error}`);
    }

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    let response;
    try {
      response = await db.getCollection("team").findOne({ email });
    } catch (error) {
      throw new Error(`Failed to get team: ${error}`);
    } finally {
      try {
        await db.close();
      } catch (error) {
        throw new Error(`Failed to close to database: ${error}`);
      }
    }

    return response;
  }
}
