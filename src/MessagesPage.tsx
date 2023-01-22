import { query, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Layout from "./components/Layout/Layout";
import MessageUserProfile from "./components/MessageUserProfile/MessageUserProfile";
import { db } from "./firebaseConfig";
import { useAppSelector } from "./redux/hooks";
import { Message, Student, Teacher } from "./types";
import converter from "./utils/converter";

export default function MessagesPage() {
  const profile = useAppSelector((state) => state.profile).profile;
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentsOrTeachers, setStudentsOrTeachers] = useState<
    Student[] | Teacher[]
  >([]);
  useEffect(() => {
    const fetchStudents = async () => {
      const q = query(
        collection(
          db,
          "users",
          profile.uid,
          profile.type === "student" ? "teachers" : "students"
        )
      ).withConverter(converter<Teacher | Student>());
      const querySnapshot = await getDocs(q);
      const newStudentsOrTeachers: Student[] | Teacher[] = [];
      querySnapshot.forEach((doc) => {
        newStudentsOrTeachers.push(doc.data());
      });
      setStudentsOrTeachers(newStudentsOrTeachers);
    };
    fetchStudents();
  }, [profile.type, profile.uid]);

  useEffect(() => {
    const fetchMessages = async (studentOrTeacher: Student | Teacher) => {
      const newMessages: Message[] = [];
      const q = query(
        collection(
          db,
          "users",
          profile.uid,
          profile.type === "student" ? "teachers" : "students",
          studentOrTeacher.uid,
          "messages"
        )
      ).withConverter(converter<{ text: string; isSeen: boolean }>());
      const querySnapshot = await getDocs(q);
      const userMessages: { text: string; isSeen: boolean }[] = [];
      querySnapshot.forEach((doc) => {
        userMessages.push(doc.data());
      });

      newMessages.push({
        ...studentOrTeacher,
        messages: userMessages,
      });

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    };
    studentsOrTeachers.forEach((studentOrTeacher) => {
      fetchMessages(studentOrTeacher);
    });
  }, [profile.type, profile.uid, studentsOrTeachers]);

  return (
    <Layout>
      {messages.map((message, index) => (
        <MessageUserProfile
          key={index}
          iconUrl={message.photoURL}
          name={message.email}
          message={message.messages[0] ? message.messages[0].text : ""}
        />
      ))}
      <MessageUserProfile
        iconUrl="https://cdn.midjourney.com/2cd09984-a602-4b3d-bc3b-e565bfba82b1/grid_0.png"
        name="Jack Daniels"
        message="Hey can you buy me some whiskey on the way home?"
      />
    </Layout>
  );
}
