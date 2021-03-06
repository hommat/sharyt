import Room from "./Room";
import User from "./User";

export type PlayVideoData = { time: number; roomId: string };
export type PauseVideoData = { time: number; roomId: string };
export type ChangeVideoData = { videoId: string; roomId: string };
export type SendMessageData = { userId: string; content: string };
export type JoinRoomCallback = (
  room?: Room,
  username?: Omit<User, "room">
) => void;
