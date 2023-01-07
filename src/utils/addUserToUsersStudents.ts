import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { UserProfileData } from "../types";
import converter from "./converter";

const addUserToUsersStudents = async (
  user: UserProfileData,
  userToAddEmail: string,
  userToAddUid: string,
  photoURL?: string | null
) => {
  const userRef = doc(db, "users", user.uid).withConverter(
    converter<UserProfileData>()
  );
  await updateDoc(userRef, {
    students: [
      ...user.students,
      { email: userToAddEmail, uid: userToAddUid, photoURL: photoURL ?? "" },
    ],
  });
};
export default addUserToUsersStudents;
