import { UserInfo } from "firebase/auth";

export type Student = { uid: string; email: string; photoURL: string };
export interface UserProfileData {
  emailVerified: boolean;

  isAnonymous: boolean;

  providerData: UserInfo[];

  refreshToken: string;
  uid: string;
  students: Student[];
  email: string;
}
