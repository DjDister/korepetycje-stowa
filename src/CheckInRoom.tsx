import {
  query,
  collection,
  getDocs,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NavBar from "./components/navBar/navBar";
import { db } from "./firebaseConfig";
import { useAppSelector } from "./redux/hooks";
type RoomData = {
  roomName: string;
};
export function CheckInRoom() {
  const [checkInName, setCheckInName] = useState("");
  const [roomName, setRoomName] = useState("");

  const state = useLocation();
  const navigate = useNavigate();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const hostId = state.pathname.substring(6, 34);
  const roomId = state.pathname.substring(35, 55);

  useEffect(() => {
    if (loginStatus.user && loginStatus.user.email)
      setCheckInName(loginStatus.user.email);

    const fetchRoom = async () => {
      const docRef = doc(db, "users", hostId, "rooms", roomId);
      const docSnap = (await (await getDoc(docRef)).data()) as RoomData;

      setRoomName(docSnap.roomName);
    };
    fetchRoom();
  }, []);

  const join = async () => {
    const roomsRef = collection(
      db,
      "users",
      hostId,
      "rooms",
      roomId,
      "attendees"
    );

    const atendeeId = await addDoc(roomsRef, {
      checkInName: checkInName,
      userId: loginStatus.user?.uid,
      rank: hostId === loginStatus.user?.uid ? "admin" : "user",
      accepted: hostId === loginStatus.user?.uid ? "true" : "false",
    });

    navigate(`/room/${hostId}/${roomId}`, {
      state: {
        checkInName: checkInName,
        userId: loginStatus.user?.uid,
        rank: hostId === loginStatus.user?.uid ? "admin" : "user",
        accepted: hostId === loginStatus.user?.uid ? "true" : "false",
        yourAttendeeId: atendeeId.id,
        roomName: roomName,
      },
    });
  };

  return (
    <div>
      <NavBar />
      <div>CheckInRoom</div>
      <div>Connecting to {roomName}</div>
      <div>Set your display name: </div>
      <input
        placeholder={checkInName}
        type="text"
        onChange={(e) => setCheckInName(e.target.value)}
      />
      <div onClick={join}>Join</div>
    </div>
  );
}

export function withRouter(Children: any) {
  return (props: any) => {
    const match = { params: useParams() };
    return <Children {...props} match={match} />;
  };
}

export default withRouter(CheckInRoom);
