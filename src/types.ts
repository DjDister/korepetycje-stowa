import { UserInfo } from "firebase/auth";

export type accType = "student" | "teacher";

export type Student = { uid: string; email: string; photoURL: string };
export interface UserProfileData {
  emailVerified: boolean;
  type: accType;
  isAnonymous: boolean;

  providerData: UserInfo[];

  refreshToken: string;
  uid: string;
  students: Student[];
  email: string;
}

export type Room = {
  roomName: string;
  id: string;
  createdAt: Date;
};

export type Teacher = {
  uid: string;
  email: string;
  photoURL: string;
};

export interface UserMessages extends Teacher, Student {
  messages: Message[];
}

export interface Message {
  text: string;
  isSeen: boolean;
  sendBy: string;
}
