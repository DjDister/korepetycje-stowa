import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { Rating, Student } from "../../types";
import Chat from "../Icons/Chat";
import Phone from "../Icons/Phone";
import StudentIcon from "../Icons/StudentIcon";
import StarsRating from "../StarsRating/StarsRating";
import styles from "./StudentCard.module.css";
export default function StudentCard({
  student,
  customStyles,
  belongsToUserId,
  studentId,
  rating,
}: {
  student: Student;
  customStyles?: React.CSSProperties;
  belongsToUserId: string;
  studentId: string;
  rating?: number;
}) {
  const [showDiv, setShowDiv] = useState(false);
  const icons = [
    {
      icon: <StudentIcon />,
      url: "/lessons",
      params: { studentId: studentId, belongsToUserId },
    },
    { icon: <Phone />, url: "/", params: null, message: "Nr tel: 123456789"  },
    {
      icon: <Chat />,
      url: "/messages",
      params: { navigatedFromUser: studentId },
    },
  ];
  const teacherInStudentRef = doc(
    db,
    "users",
    studentId,
    "teachers",
    belongsToUserId
  );
  const navigate = useNavigate();
  const setRating = async (rating: number) => {
    updateDoc(teacherInStudentRef, {
      rating: rating,
    });
    const teacherRef = doc(db, "users", belongsToUserId);
    const teacher = await getDoc(teacherRef);
    const ratings = teacher.data()?.ratings || [];

    updateDoc(teacherRef, {
      ratings: [
        ...ratings.filter((r: Rating) => r.givenBy !== studentId),
        { givenBy: studentId, rating: rating },
      ],
    });
  };

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
      {student.type === "teacher" ? (
        <StarsRating
          value={rating}
          handleDataFromChild={(rating) => setRating(rating)}
        />
      ) : null}
      <div>{student.type === "teacher" ? "Teacher" : "Student"}</div>
      <div className={styles.iconsContainer}>
        {icons.map((icon, index) => (
              <div
              className={styles.iconContainer}
              key={index}
              onMouseEnter={() => {
                if (icon.message) {
                  setShowDiv(true); 
                }
              }}
              onMouseLeave={() => setShowDiv(false)}
            >
            <div onClick={() => navigate(icon.url, { state: icon.params })}>
              {icon.icon}
            </div>
          </div>
        ))}
        {showDiv && (
        <div className={styles.messageDiv}>
         {student.email}(Phone number)
        </div>
      )}
      </div>
    </div>
  );
}
