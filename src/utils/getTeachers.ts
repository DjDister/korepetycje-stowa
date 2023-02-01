import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";
import { Teacher, UserProfileData } from "../types";
import converter from "./converter";

const getTeachers = async () => {
  const teachers: Teacher[] = [];
  const q = query(
    collection(db, "users"),
    where("type", "==", "teacher")
  ).withConverter(converter<UserProfileData>());
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    const teacher = {
      email: doc.data().email,
      uid: doc.data().uid,
      photoURL: doc.data().providerData[0].photoURL || "",
    };
    teachers.push(teacher);
  });
  return teachers;
};

export default getTeachers;
