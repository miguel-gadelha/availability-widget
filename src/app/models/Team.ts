import { hash, compare } from "bcrypt";
import { sign, Secret } from "jsonwebtoken";
import { Database } from "../lib/db";
import Validator from "../lib/utils/validator";
import { ObjectId } from "mongodb";

export interface TeamSettings {
  _id?: string;
  name: string;
  email: string;
  teamMembers: string[];
}

export class Team {
  constructor(
    private name: TeamSettings["name"],
    private password: string,
    private email: TeamSettings["email"],
    private teamMembers: string[]
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
    let emailNotUnique;

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }
    try {
      emailNotUnique = await db
        .getCollection("team")
        .findOne({ email: this.email });
    } catch {
      await db.close();
    }

    if (emailNotUnique) {
      throw new Error("Email already exists");
    }

    try {
      const hashedPassword = await hash(
        this.password,
        Number(process.env.SALTROUNDS)
      );
      this.password = hashedPassword;
    } catch (error) {
      await db.close();
      throw new Error(`Failed to hash the password: ${error}`);
    }

    try {
      const result = await db.getCollection("team").insertOne({
        name: this.name,
        email: this.email,
        password: this.password,
        teamMembers: this.teamMembers,
      });

      return result;
    } finally {
      await db.close();
    }
  }

  public static async login(email: string, password: string): Promise<string> {
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

  protected static async findTeam(query: object) {
    const db = Database.getInstance();

    const isConnected = await db.connect();

    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }
    try {
      const response = await db.getCollection("team").findOne({ ...query });

      return response;
    } finally {
      await db.close();
    }
  }

  public static async findByEmail(email: string) {
    if (!Validator.email(email)) {
      throw new Error("Invalid email");
    }

    return await this.findTeam({ email: email });
  }

  public static async findById(teamId: string) {
    return await this.findTeam({ _id: new ObjectId(teamId) });
  }
}
