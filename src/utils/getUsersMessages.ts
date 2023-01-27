import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { accType, Message, Student, Teacher, UserMessages } from "../types";
import converter from "./converter";

const getUsersMessages = async (userId: string, accType: accType) => {
  const messages: UserMessages[] = [];
  const q = query(
    collection(
      db,
      "users",
      userId,
      accType === "student" ? "teachers" : "students"
    )
  ).withConverter(converter<Teacher | Student>());
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    const userMessages: Message[] = [];
    await getDocs(
      query(collection(doc.ref, "messages")).withConverter(converter<Message>())
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        userMessages.push(doc.data());
      });
    });
    messages.push({ ...doc.data(), messages: userMessages });
  });

  return messages;
};

export default getUsersMessages;
