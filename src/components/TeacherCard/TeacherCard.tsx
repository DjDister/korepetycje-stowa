import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { useAppSelector } from "../../redux/hooks";
import { Teacher } from "../../types";
import addToProfilesForMessages from "../../utils/addToProfilesForMessages";
import Eye from "../Icons/Eye";
import MessageIcon from "../Icons/MessageIcon";
import Person from "../Icons/Person";
import Star from "../Icons/Star";
import styles from "./TeacherCard.module.css";
export default function TeacherCard({
  teacher,
  customStyle,
}: {
  teacher: Teacher & { subjects?: string[]; amountOfStudents?: number };
  customStyle?: React.CSSProperties;
}) {
  const [showMessageButton, setShowMessageButton] = useState(false);
  const navigate = useNavigate();
  const addTeacherToMessages = async () => {
    if (!loginStatus.isLoggedIn) {
      alert("You need to be logged in to send messages");
      return;
    }

    const docRef = doc(
      db,
      "users",
      profile.uid,
      profile.type === "student" ? "teachers" : "students",
      teacher.uid
    );
    const document = await getDoc(docRef);

    if (!document.exists()) {
      await addToProfilesForMessages(
        profile,
        teacher.email,
        teacher.uid,
        teacher.photoURL,
        true
      );
    }
    navigate("/messages", { state: { navigatedFromUser: teacher.uid } });
  };

  const { profile } = useAppSelector((state) => state.profile);
  const loginStatus = useAppSelector((state) => state.loginStatus);
  return (
    <div className={styles.cardContainer} style={customStyle}>
      <div
        onMouseLeave={() => setShowMessageButton(false)}
        onMouseEnter={() => setShowMessageButton(true)}
        style={{ position: "relative" }}
      >
        <img
          className={styles.cardImage}
          src={teacher.photoURL}
          alt="profilePic"
        />
        <div
          style={
            showMessageButton && profile.type === "student"
              ? {}
              : { display: "none" }
          }
          className={showMessageButton ? styles.hoverElement : ""}
        >
          <div
            onClick={() => addTeacherToMessages()}
            style={{ cursor: "pointer" }}
          >
            <MessageIcon size={"42"} />
          </div>
        </div>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.flexCenter}>
          <Star style={{ height: "20px" }} stroke="#FFAD0D" />
          {teacher.rating || 0}
        </div>
        <div className={styles.flexCenter}>
          <Eye height="20" stroke="red" />
          244
        </div>
        <div className={styles.flexCenter}>
          <Person height="20" stroke="green" />
          {teacher.amountOfStudents}
        </div>
      </div>
      <div className={styles.nameContainer}>
        {teacher.displayName || teacher.email}
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.subjectTagsContainer}>
          {teacher.subjects?.slice(0, 4).map((subject, index) => (
            <div key={index} className={styles.subjectTag}>
              #{subject}
            </div>
          ))}
        </div>
        <div className={styles.priceContainer}>52$/h</div>
      </div>
    </div>
  );
}
