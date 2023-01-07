import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { UserProfileData } from "../types";
import converter from "./converter";

const searchForUserWithEmail = async (email: string) => {
  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  ).withConverter(converter<UserProfileData>());

  const querySnapshot = await getDocs(q);

  const users: UserProfileData[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
  if (users.length === 0) return undefined;
  return users[0];
};
export default searchForUserWithEmail;
