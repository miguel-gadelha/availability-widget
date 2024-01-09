import { hash, compare } from "bcrypt";
import { sign, Secret } from "jsonwebtoken";
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

    isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    const emailNotUnique = await db
      .getCollection("team")
      .findOne({ email: this.email });

    if (emailNotUnique) {
      throw new Error("Email already exists");
    }

    try {
      const hashedPassword = await hash(
        this.password,
        process.env.SALTROUNDS as string
      );
      this.password = hashedPassword;
    } catch (error) {
      throw new Error(`Failed to hash the password: ${error}`);
    }

    const result = await db.getCollection("team").insertOne({
      name: this.name,
      email: this.email,
      password: this.password,
      teamMembers: this.teamMembers,
    });

    await db.close();

    return result;
  }

  static async login(email: string, password: string) {
    if (!Validator.email(email)) {
      throw new Error("Invalid email");
    }

    if (!Validator.password(password)) {
      throw new Error("Invalid password");
    }

    const team = await this.findByEmail(email);

    if (!team) {
      throw new Error("Team does not exist in db");
    }

    const isValid = await compare(password, team.password);
    if (isValid) {
      return sign({ team }, process.env.JWT_SECRET as Secret);
    }

    throw new Error("Invalid credentials");
  }

  static async findByEmail(email: string) {
    if (!Validator.email(email)) {
      throw new Error("Invalid email");
    }

    const db = Database.getInstance();

    const isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    const response = await db.getCollection("team").findOne({ email });

    await db.close();

    return response;
  }
}
