import {
  query,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ArrowRight from "../../components/Icons/ArrowRight";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";
import MessageUserProfile from "../../components/MessageUserProfile/MessageUserProfile";
import { db } from "../../firebaseConfig";
import { useAppSelector } from "../../redux/hooks";
import { Message, Student, Teacher, UserMessages } from "../../types";
import converter from "../../utils/converter";
import sortMessByTimeStamp from "../../utils/sortMessByTimeStamp";
import styles from "./MessagesPage.module.css";
export default function MessagesPage() {
  //to fix : sending message then messages are sorted and you can see them teleport to the bottom
  //to fix: when you click again at the same user, the messages are coming up with state before any changes

  const profile = useAppSelector((state) => state.profile).profile;
  const [messages, setMessages] = useState<UserMessages[]>([]);
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
      const newMessages: UserMessages[] = [];
      const q = query(
        collection(
          db,
          "users",
          profile.uid,
          profile.type === "student" ? "teachers" : "students",
          studentOrTeacher.uid,
          "messages"
        )
      ).withConverter(converter<Message>());
      const querySnapshot = await getDocs(q);
      const userMessages: Message[] = [];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.type, profile.uid, studentsOrTeachers]);

  const [chosenUser, setChosenUser] = useState<UserMessages>(messages[0]);
  const [search, setSearch] = useState<string>("");
  const [messageToSend, setMessageToSend] = useState<string>("");

  const sendMessage = async (user: UserMessages) => {
    const messageToAdd = {
      isSeen: false,
      sendBy: profile.uid,
      text: messageToSend,
      createdAt: serverTimestamp() as Timestamp,
    };
    await addDoc(
      collection(
        db,
        "users",
        profile.uid,
        profile.type === "student" ? "teachers" : "students",
        user.uid,
        "messages"
      ),
      messageToAdd
    );
  };
  const [chosenuserMessages, setChosenUserMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (chosenUser) {
      onSnapshot(
        collection(
          db,
          "users",
          profile.uid,
          profile.type === "student" ? "teachers" : "students",
          chosenUser.uid,
          "messages"
        ).withConverter(converter<Message>()),
        (querySnapshot) => {
          const userMessages: Message[] = [];
          querySnapshot.forEach((doc) => {
            userMessages.push(doc.data());
          });
          setChosenUserMessages(sortMessByTimeStamp(userMessages));
        }
      );
    }
  }, [chosenUser, profile.type, profile.uid]);

  return (
    <Layout>
      <div className={styles.pageSplitter}>
        <div className={styles.latestsMessagesContainer}>
          <div className={styles.labelContainer}>
            <div className={styles.chatsTitle}>Chats</div>
            <Input
              style={{ width: "100%" }}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {messages
            .filter((mess) => mess.email.includes(search))
            .map((message, index) => (
              <MessageUserProfile
                uid={message.uid}
                customStyles={{ width: "100%" }}
                key={index}
                iconUrl={message.photoURL}
                name={message.email}
                message={message.messages[0] ? message.messages[0].text : ""}
                onClick={() => {
                  setChosenUser(message);
                  setChosenUserMessages(message.messages);
                }}
              />
            ))}
        </div>
        {chosenUser ? (
          <div className={styles.chatContainer}>
            <div className={styles.userChatContainer}>
              <div className={styles.chosenUserContainer}>
                <img
                  className={styles.userIcon}
                  src={chosenUser.photoURL}
                  alt="UserPic"
                />
                <div className={styles.userName}>{chosenUser.email}</div>
              </div>
              <div className={styles.messagesContainer}>
                {chosenuserMessages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.sendBy === profile.uid
                        ? styles.messageByYou
                        : styles.messageByOtherUser
                    }
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.sendMessageContainer}>
              <Input
                style={{ width: "100%" }}
                placeholder="Type your message"
                onChange={(e) => setMessageToSend(e.target.value)}
                icon={<ArrowRight />}
                onClick={() => sendMessage(chosenUser)}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
