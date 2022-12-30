import { doc, deleteDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import styles from "./RoomItem.module.css";
type RoomProps = {
  roomName: string;
  id: string;
};

export default function RoomItem({
  room,
  userId,
}: {
  room: RoomProps;
  userId: string;
}) {
  const navigate = useNavigate();

  const deleteRoom = async () => {
    await deleteDoc(doc(db, "users", userId, "rooms", room.id));
  };

  return (
    <div className={styles.roomContainer}>
      <div
        onClick={() =>
          navigate(`/room/${userId}/${room.id}/checkin`, {
            state: { hostId: userId, roomId: room.id },
          })
        }
        className={styles.roomNameContainer}
      >
        {room.roomName}
      </div>
      <div onClick={deleteRoom} className={styles.deleteButton}>
        delete
      </div>
    </div>
  );
}
