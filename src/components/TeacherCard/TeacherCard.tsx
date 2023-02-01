import React from "react";
import { Teacher } from "../../types";
import Eye from "../Icons/Eye";
import Person from "../Icons/Person";
import Star from "../Icons/Star";
import styles from "./TeacherCard.module.css";
export default function TeacherCard({
  teacher,
  customStyle,
}: {
  teacher: Teacher;
  customStyle?: React.CSSProperties;
}) {
  return (
    <div className={styles.cardContainer} style={customStyle}>
      <img
        className={styles.cardImage}
        src={teacher.photoURL}
        alt="profilePic"
      />
      <div className={styles.statsContainer}>
        <div className={styles.flexCenter}>
          <Star style={{ height: "100%" }} stroke="#FFAD0D" />
          4.5
        </div>
        <div className={styles.flexCenter}>
          <Eye height="24" />
          244
        </div>
        <div className={styles.flexCenter}>
          <Person height="24" />
          12
        </div>
      </div>
      <div className={styles.nameContainer}>{teacher.email}</div>
      <div className={styles.subjectTagsContainer}>
        <div className={styles.subjectTag}>#Math</div>
      </div>
    </div>
  );
}
