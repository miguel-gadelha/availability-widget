export interface Sprint {
  name: string;
  length: number;
  members: [{ name: string; days: number }];
  availability?: number;
  teamId?: string;
}
