import { UserInfo } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type accType = "student" | "teacher";

export type Student = {
  uid: string;
  email: string;
  photoURL: string;
  type?: accType;
};
export interface UserProfileData {
  emailVerified: boolean;
  type: accType;
  isAnonymous: boolean;
  displayName: string;
  providerData: UserInfo[];
  phoneNumber?: string;
  refreshToken: string;
  uid: string;
  students: Student[];
  email: string;
  createdAt: Timestamp;
  subjects: string[] | undefined;
  ratings?: Rating[];
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
  rating?: number;
  amountOfStudents?: number;
  subjects?: string[];
};

export interface UserMessages extends Teacher, Student {
  messages: Message[];
}

export interface Message {
  text: string;
  isSeen: boolean;
  sendBy: string;
  createdAt: Timestamp;
}

export type Rating = {
  givenBy: string;
  rating: number;
};
