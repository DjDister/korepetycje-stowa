import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Student, UserProfileData } from "../types";
import converter from "./converter";

const addUserToUsersStudents = async (
  user: UserProfileData,
  userToAddEmail: string,
  userToAddUid: string,
  photoURL?: string | null
) => {
  const studentsRef = doc(
    db,
    "users",
    user.uid,
    "students",
    userToAddUid
  ).withConverter(converter<Student>());
  await setDoc(studentsRef, {
    email: userToAddEmail,
    uid: userToAddUid,
    photoURL: photoURL ?? "",
  });
};
export default addUserToUsersStudents;
