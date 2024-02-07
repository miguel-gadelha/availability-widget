export type MemberVacations = { name: string; days: number | "" };

export interface Sprint {
  name: string;
  length: number;
  members: MemberVacations[];
  availability?: number;
  teamId?: string;
}
