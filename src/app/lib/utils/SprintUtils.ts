import { Sprint } from "@/types";

export default class SprintUtils {
  public static calculateAvailability(
    members: Sprint["members"],
    length: number
  ): number {
    const totalDaysOut = members.reduce(
      (total, member) => total + (member.days as number),
      0
    );

    const totalSprintDays = length * members.length;
    const actualSprintDays = totalSprintDays - totalDaysOut;

    return (actualSprintDays * 100) / totalSprintDays;
  }
}
