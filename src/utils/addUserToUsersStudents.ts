import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Student, UserProfileData, Teacher } from "../types";
import converter from "./converter";

const addUserToUsersStudents = async (
  user: UserProfileData,
  userToAddEmail: string,
  userToAddUid: string,
  photoURL?: string | null
) => {
  //to do add yourself as teacher to the student
  const teachersRef = doc(
    db,
    "users",
    userToAddUid,
    "teachers",
    user.uid
  ).withConverter(converter<Teacher>());
  await setDoc(teachersRef, {
    email: user.email,
    uid: user.uid,
    photoURL: user.providerData[0].photoURL ?? "",
  });
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
