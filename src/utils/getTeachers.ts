import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";
import { Student, Teacher } from "../types";
import converter from "./converter";

const getTeachers = async () => {
  const teachers: Teacher[] = [];
  const q = query(
    collection(db, "users"),
    where("type", "==", "teacher")
  ).withConverter(converter<Teacher | Student>());
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    teachers.push(doc.data());
  });
  return teachers;
};

export default getTeachers;
