import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Student, UserProfileData, Teacher } from "../types";
import converter from "./converter";

const addToProfilesForMessages = async (
  user: UserProfileData,
  userToAddEmail: string,
  userToAddUid: string,
  photoURL?: string | null,
  isOnlyForMessages?: boolean
) => {
  const teachersRef = doc(
    db,
    "users",
    userToAddUid,
    "students",
    user.uid
  ).withConverter(converter<Teacher>());
  await setDoc(teachersRef, {
    email: user.email,
    uid: user.uid,
    photoURL: user.providerData[0].photoURL ?? "",
    isOnlyForMessages: isOnlyForMessages ?? false,
  });
  const studentsRef = doc(
    db,
    "users",
    user.uid,
    "teachers",
    userToAddUid
  ).withConverter(converter<Student>());
  await setDoc(studentsRef, {
    email: userToAddEmail,
    uid: userToAddUid,
    photoURL: photoURL ?? "",
    isOnlyForMessages: isOnlyForMessages ?? false,
  });
};
export default addToProfilesForMessages;
