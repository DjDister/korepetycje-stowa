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
  serverTimestamp,
} from "firebase/firestore";
import { useAppSelector } from "./redux/hooks";
import { useNavigate } from "react-router-dom";
import RoomItem from "./components/RoomItem/RoomItem";
import "./RoomsPage.css";
type Room = {
  roomName: string;
  id: string;
};

export default function RoomsPage() {
  const [newRoomName, setNewRoomName] = useState("");
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  console.log(loginStatus);
  useEffect(() => {
    if (!loginStatus.isLoggedIn) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const fetchRooms = async () => {
      if (loginStatus.user) {
        const q = query(collection(db, "users", loginStatus.user.uid, "rooms"));

        const querySnapshot = await getDocs(q);
        const fetchedRooms: Room[] = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          const room: Room = {
            roomName: doc.data().roomName,
            id: doc.id,
          };
          fetchedRooms.push(room);
        }, []);
        setActiveRooms(fetchedRooms);
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    if (loginStatus.user) {
      const userRef = doc(db, "users", loginStatus.user.uid);
      await setDoc(userRef, loginStatus.user);
      const roomsRef = collection(db, "users", loginStatus.user.uid, "rooms");

      const newRoom = await addDoc(roomsRef, {
        roomName: newRoomName,
        createdAt: serverTimestamp(),
      });

      setActiveRooms((prev) => [
        ...prev,
        {
          roomName: newRoomName,
          id: newRoom.id,
        },
      ]);
    }
  };
  return (
    <div>
      <NavBar />
      <div className="pageContainer">
        <div className="title">Create room: </div>
        <input
          placeholder="Room Id"
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <div onClick={() => createRoom()}>Create</div>
        <div className="title">Your rooms: </div>
        <div className="roomsListContainer">
          {activeRooms.map((room, index) => (
            <RoomItem
              key={index}
              userId={loginStatus.user ? loginStatus.user.uid : ""}
              room={room}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
