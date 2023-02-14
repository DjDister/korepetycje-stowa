import {
  query,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ArrowRight from "../../components/Icons/ArrowRight";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";
import MessageUserProfile from "../../components/MessageUserProfile/MessageUserProfile";
import { db } from "../../firebaseConfig";
import { useAppSelector } from "../../redux/hooks";
import { Message, Student, Teacher, UserMessages } from "../../types";
import converter from "../../utils/converter";
import getUserDisplayNameWithUid from "../../utils/getUserDisplayNameWithUid";
import styles from "./MessagesPage.module.css";
export default function MessagesPage() {
  const { state } = useLocation();
  const profile = useAppSelector((state) => state.profile).profile;
  const [usersAndMessages, setUsersAndMessages] = useState<UserMessages[]>([]);
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
        if (state && state.navigatedFromUser === doc.data().uid) {
          setChosenUser({
            ...doc.data(),
            messages: [],
          });
        }
      });
      const getUserDisplayName = async (
        studentOrTeacher: Student | Teacher
      ) => {
        const displayName = await getUserDisplayNameWithUid(
          studentOrTeacher.uid
        );

        setStudentsOrTeachers((prevStudentsOrTeachers) => [
          ...prevStudentsOrTeachers,
          { ...studentOrTeacher, displayName },
        ]);
      };

      newStudentsOrTeachers.forEach(async (studentOrTeacher) => {
        getUserDisplayName(studentOrTeacher);
      });
    };
    fetchStudents();
  }, [profile.type, profile.uid]);

  useEffect(() => {
    const fetchMessages = async (studentOrTeacher: Student | Teacher) => {
      const newUserAndMessages: UserMessages[] = [];
      const q = query(
        collection(
          db,
          "users",
          profile.uid,
          profile.type === "student" ? "teachers" : "students",
          studentOrTeacher.uid,
          "messages"
        ),
        orderBy("createdAt")
      ).withConverter(converter<Message>());
      const querySnapshot = await getDocs(q);
      const userMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        userMessages.push(doc.data());
      });

      newUserAndMessages.push({
        ...studentOrTeacher,
        messages: userMessages,
      });
      setUsersAndMessages((prevMessages) => [
        ...prevMessages,
        ...newUserAndMessages,
      ]);
    };

    studentsOrTeachers.forEach((studentOrTeacher) => {
      fetchMessages(studentOrTeacher);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.type, profile.uid, studentsOrTeachers]);

  const [chosenUser, setChosenUser] = useState<UserMessages>(
    usersAndMessages[0]
  );
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
    await addDoc(
      collection(
        db,
        "users",
        user.uid,
        profile.type === "student" ? "students" : "teachers",
        profile.uid,
        "messages"
      ),
      messageToAdd
    );
  };

  const [chosenuserMessages, setChosenUserMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (chosenUser) {
      const messagesColl = collection(
        db,
        "users",
        profile.uid,
        profile.type === "student" ? "teachers" : "students",
        chosenUser.uid,
        "messages"
      ).withConverter(converter<Message>());
      const messageQuery = query(messagesColl, orderBy("createdAt"));
      onSnapshot(messageQuery, (querySnapshot) => {
        const userMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          userMessages.push(doc.data());
        });
        setChosenUserMessages(userMessages);
      });
    }
  }, [chosenUser, profile.type, profile.uid]);

  const messRef = useRef<HTMLDivElement>(null);
  if (messRef.current) {
    messRef.current.scrollTop = messRef.current.scrollHeight;
  }

  return (
    <Layout>
      <div className={styles.pageSplitter}>
        <div className={styles.latestsMessagesContainer}>
          <div className={styles.labelContainer}>
            <div className={styles.chatsTitle}>Chats</div>
            <Input
              value={search}
              style={{ width: "100%" }}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {usersAndMessages
            .filter((mess, index, arr) => {
              return index === arr.findIndex((o) => o.uid === mess.uid);
            })
            .filter((mess) => mess.email.includes(search))
            .map((message, index) => (
              <MessageUserProfile
                uid={message.uid}
                customStyles={{ width: "100%" }}
                key={index}
                iconUrl={message.photoURL}
                name={message.displayName || message.email}
                message={
                  message.messages[message.messages.length - 1]
                    ? message.messages[message.messages.length - 1].text
                    : ""
                }
                onClick={() => {
                  setChosenUser(message);
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
              <div ref={messRef} className={styles.messagesContainer}>
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
                value={messageToSend}
                placeholder="Type your message"
                onChange={(e) => setMessageToSend(e.target.value)}
                icon={<ArrowRight />}
                onClick={() => {
                  if (messageToSend === "") return;
                  sendMessage(chosenUser);
                  setMessageToSend("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (messageToSend === "") return;
                    e.preventDefault();
                    sendMessage(chosenUser);
                    setMessageToSend("");
                  }
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
