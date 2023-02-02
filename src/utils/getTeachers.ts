import { collection, getDocs, limit, query, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";
import { Teacher, UserProfileData } from "../types";
import converter from "./converter";

const getTeachers = async (filter?: string | null) => {
  const teachers: Teacher[] = [];
  const q = query(
    collection(db, "users"),
    where("type", "==", "teacher"),
    limit(8)
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
