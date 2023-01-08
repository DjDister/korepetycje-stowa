import { User } from "firebase/auth";
import { doc, Firestore, setDoc } from "firebase/firestore";
import { UserProfileData } from "../types";
import converter from "./converter";
const photoDefault =
  "https://cdn.midjourney.com/2cd09984-a602-4b3d-bc3b-e565bfba82b1/grid_0.png";
const writeUserToDatabase = async (
  db: Firestore,
  user: User,
  accType: "student" | "teacher"
) => {
  const docRef = doc(db, "users", user.uid).withConverter(
    converter<UserProfileData>()
  );

  const userData: UserProfileData = {
    uid: user.uid,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    providerData: [
      ...user.providerData.filter((provider, index) => index > 0),
      {
        ...user.providerData[0],
        photoURL: user.providerData[0].photoURL ?? photoDefault,
      },
    ],
    refreshToken: user.refreshToken ?? "",
    type: accType,
    students: [],
    email: user.email || "",
  };
  await setDoc(docRef, userData);
};
export default writeUserToDatabase;
