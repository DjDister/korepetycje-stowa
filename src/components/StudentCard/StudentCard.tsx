import React from "react";
import { Student } from "../../types";
import Chat from "../Icons/Chat";
import Phone from "../Icons/Phone";
import StudentIcon from "../Icons/StudentIcon";
import styles from "./StudentCard.module.css";
export default function StudentCard({
  student,
  customStyles,
}: {
  student: Student;
  customStyles?: React.CSSProperties;
}) {
  const icons = [<StudentIcon />, <Chat />, <Phone />];
  return (
    <div className={styles.cardContainer} style={customStyles}>
      <div className={styles.imageContainer}>
        <img
          alt={student.email}
          src={student.photoURL}
          style={{ width: "100%", height: "100%", objectFit: "scale-down" }}
        />
      </div>
      <div className={styles.nameContainer}>{student.email}</div>
      <div>Student</div>
      <div className={styles.iconsContainer}>
        {icons.map((icon, index) => (
          <div className={styles.iconContainer} key={index}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
