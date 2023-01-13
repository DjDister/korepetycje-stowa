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
  belongsToUserId,
  studentId,
}: {
  student: Student;
  customStyles?: React.CSSProperties;
  belongsToUserId: string;
  studentId: string;
}) {
  const icons = [
    {
      icon: <StudentIcon />,
      url: "/lessons",
      params: { studentId: studentId, belongsToUserId: belongsToUserId },
    },
    { icon: <Phone />, url: "/", params: null },
    { icon: <Chat />, url: "/", params: null },
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
            <div onClick={() => navigate(icon.url, { state: icon.params })}>
              {icon.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
