import { useEffect, useState } from "react";
import NavBar from "./components/navBar/navBar";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAppSelector } from "./redux/hooks";
import { useNavigate } from "react-router-dom";
type Room = {
  roomName: string;
};
export default function RoomPage() {
  const [newRoomId, setNewRoomId] = useState("");
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  const loginStatus = useAppSelector((state) => state.loginStatus);
  console.log(loginStatus);
  useEffect(() => {
    if (!loginStatus.isLoggedIn) {
      navigate("/login");
    }
  }, [loginStatus.isLoggedIn]);
  useEffect(() => {
    if (loginStatus.user) {
    }
    const fetchRooms = async () => {
      if (loginStatus.user) {
        const q = query(collection(db, "users", loginStatus.user.uid, "rooms"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data()); //fix types for querying data from firebase , make it Room type
          const room: any = doc.data();
          setActiveRooms((previousState) => [...previousState, room]);
        }, []);
      }
    };
    fetchRooms();
  }, []);
  console.log(activeRooms);
  const connect = async () => {
    if (loginStatus.user) {
      const userRef = doc(db, "users", loginStatus.user.uid);
      await setDoc(userRef, loginStatus.user);
      const roomsRef = doc(
        collection(db, "users", loginStatus.user.uid, "rooms")
      );
      await setDoc(roomsRef, { roomName: newRoomId });
    } else {
      //navigate to login page
    }
  };
  return (
    <div>
      <NavBar />
      <div>
        <input
          placeholder="Room Id"
          onChange={(e) => setNewRoomId(e.target.value)}
        />
        <div onClick={() => connect()}>Connect</div>
        {activeRooms.map((room, index) => (
          <div key={index}>{room.roomName}</div>
        ))}
      </div>
    </div>
  );
}
