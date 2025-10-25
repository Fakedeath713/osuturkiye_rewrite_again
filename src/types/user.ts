export interface User {
  _id: string;
  osu_id: number;
  osu_username: string;
  discord_id?: string;
  discord_username?: string;
  createdAt: Date;
  updatedAt: Date;
}
