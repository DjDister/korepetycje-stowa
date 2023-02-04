import { collection, getDocs, limit, query, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";
import { Teacher, UserProfileData } from "../types";
import calculateRating from "./calculateRating";
import converter from "./converter";

const getTeachers = async (filter?: string | null) => {
  const teachers: Teacher[] = [];
  const q = filter
    ? query(
        collection(db, "users"),
        where("type", "==", "teacher"),
        where("subjects", "array-contains", filter),
        limit(8)
      ).withConverter(converter<UserProfileData>())
    : query(
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
      rating: calculateRating(doc.data().ratings),
      subjects: doc.data().subjects,
    };
    teachers.push(teacher);
  });
  const newTeachers = await Promise.all(
    teachers.map(async (teacher) => {
      const students = await getDocs(
        collection(db, "users", teacher.uid, "students")
      );
      teacher.amountOfStudents = students.docs.length;
      return teacher;
    })
  );

  return newTeachers;
};

export default getTeachers;
