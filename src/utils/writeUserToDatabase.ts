import { doc, Firestore, setDoc } from "firebase/firestore";
import { UserProfileData } from "../types";
import converter from "./converter";

const writeUserToDatabase = async (
  db: Firestore,
  id: string,
  email: string
) => {
  const docRef = doc(db, "users", id).withConverter(
    converter<UserProfileData>()
  );
  await setDoc(docRef, {
    students: [],
    email: email,
  });
};
export default writeUserToDatabase;
