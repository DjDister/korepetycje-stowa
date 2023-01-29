import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useAppSelector } from "../../redux/hooks";
import { Message } from "../../types";
import converter from "../../utils/converter";
import sortMessByTimeStamp from "../../utils/sortMessByTimeStamp";
import ArrowRight from "../Icons/ArrowRight";
import styles from "./MessageUserProfile.module.css";
export default function MessageUserProfile({
  iconUrl,
  name,
  message,
  customStyles,
  onClick,
  uid,
  isSeen = true,
}: {
  iconUrl: string;
  name: string;
  uid: string;
  message: string;
  customStyles?: React.CSSProperties;
  onClick?: () => void;
  isSeen?: boolean;
}) {
  const { profile } = useAppSelector((state) => state.profile);
  const [newMessage, setNewMessage] = useState<Message | undefined>(undefined);
  useEffect(() => {
    onSnapshot(
      collection(
        db,
        "users",
        profile.uid,
        profile.type === "student" ? "teachers" : "students",
        uid,
        "messages"
      ).withConverter(converter<Message>()),
      (querySnapshot) => {
        const userMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          userMessages.push(doc.data());
        });
        const newestMess =
          sortMessByTimeStamp(userMessages)[userMessages.length - 1];

        setNewMessage(newestMess);
      }
    );
  }, [profile.type, profile.uid, uid]);

  return (
    <div className={styles.container} style={customStyles}>
      <div className={styles.wrapper}>
        <div className={styles.profileIcon}>
          <div className={styles.overflowHidden}>
            <img className={styles.icon} alt="profilePic" src={iconUrl} />
          </div>
        </div>
        <div className={styles.nameMessageContainer}>
          <div className={styles.nameLabel}>{name}</div>
          <div className={styles.messageLabel}>
            {newMessage ? newMessage.text : message}
          </div>
        </div>
      </div>
      {!isSeen && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#5183F4",
          }}
        />
      )}
      <div className={styles.iconContainer} onClick={onClick}>
        <ArrowRight />
      </div>
    </div>
  );
}
