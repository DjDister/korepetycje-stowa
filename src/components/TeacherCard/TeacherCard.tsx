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
  teacher: Teacher & { subjects?: string[]; amountOfStudents?: number };
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
      <div className={styles.nameContainer}>{teacher.email}</div>
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
