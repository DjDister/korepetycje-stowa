import { doc, deleteDoc, collection, addDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { useAppSelector } from "../../redux/hooks";
import { Room } from "../../types";
import TrashCan from "../Icons/TrashCan";
import styles from "./LessonItem.module.css";

export default function LessonItem({
  belongsToUserId,
  studentId,
  lesson,
  customStyle,
}: {
  lesson: Room;
  belongsToUserId: string;
  studentId: string;
  customStyle?: React.CSSProperties;
}) {
  const navigate = useNavigate();
  const { profile } = useAppSelector((state) => state.profile);
  const deleteRoom = async () => {
    await deleteDoc(
      doc(
        db,
        "users",
        belongsToUserId,
        "students",
        studentId,
        "lessons",
        lesson.id
      )
    );
  };
  const join = async () => {
    const roomsRef = collection(
      db,
      "users",
      belongsToUserId,
      "students",
      studentId,
      "lessons",
      lesson.id,
      "attendees"
    );

    const atendee = {
      checkInName: profile.email,
      userId: profile.uid,
      rank: belongsToUserId === profile.uid ? "admin" : "user",
      accepted: "true",
    };
    const atendeeId = await addDoc(roomsRef, atendee);

    navigate(`/room/${belongsToUserId}/${lesson.id}`, {
      state: {
        ...atendee,
        yourAttendeeId: atendeeId.id,
        roomName: lesson.roomName,
        belongsToUserId: belongsToUserId,
        studentId: studentId,
        lesson: lesson,
      },
    });
  };
  const areYouAdmin = belongsToUserId === profile.uid;
  return (
    <div className={styles.roomContainer} style={customStyle}>
      <div onClick={join} className={styles.roomNameContainer}>
        <div>{lesson.roomName}</div>
        <div className={styles.dateContainer}>
          {lesson.createdAt.toDateString()}
        </div>
      </div>
      {areYouAdmin && (
        <div onClick={deleteRoom} className={styles.deleteButton}>
          <TrashCan />
        </div>
      )}
    </div>
  );
}
