import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { UserProfileData } from "../types";
import converter from "./converter";

const searchForUserWithId = async (id: string) => {
  const userRef = doc(db, "users", id).withConverter(
    converter<UserProfileData>()
  );
  const user = await getDoc(userRef);
  return user.data();
};
export default searchForUserWithId;
