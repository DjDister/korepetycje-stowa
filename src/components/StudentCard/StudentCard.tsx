import React from "react";
import { useNavigate } from "react-router-dom";
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
  const icons = [
    { icon: <StudentIcon />, url: "/" },
    { icon: <Phone />, url: "/" },
    { icon: <Chat />, url: "/" },
  ];
  const navigate = useNavigate();
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
            <div onClick={() => navigate(icon.url)}>{icon.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
