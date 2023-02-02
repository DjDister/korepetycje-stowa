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
          <Star style={{ height: "20px" }} stroke="#FFAD0D" />
          4.5
        </div>
        <div className={styles.flexCenter}>
          <Eye height="20" stroke="red" />
          244
        </div>
        <div className={styles.flexCenter}>
          <Person height="20" stroke="green" />
          12
        </div>
      </div>
      <div className={styles.nameContainer}>{teacher.email}</div>
      <div className={styles.detailsContainer}>
        <div className={styles.subjectTagsContainer}>
          <div className={styles.subjectTag}>#Math</div>
          <div className={styles.subjectTag}>#Math</div>
        </div>
        <div className={styles.priceContainer}>52$/h</div>
      </div>
    </div>
  );
}
