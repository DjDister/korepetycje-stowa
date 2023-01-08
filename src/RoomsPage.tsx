import { useEffect, useState } from "react";
import NavBar from "./components/navBar/navBar";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  query,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useAppSelector } from "./redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import LessonItem from "./components/LessonItem/LessonItem";
import "./RoomsPage.css";
import { Room } from "./types";
import Input from "./components/Input/Input";
import PlusIcon from "./components/Icons/PlusIcon";

export default function LessonsPage() {
  const [newRoomName, setNewRoomName] = useState("");
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const areYouAdmin = state.belongsToUserId === loginStatus.user?.uid;
  useEffect(() => {
    if (!loginStatus.isLoggedIn) {
      navigate("/login");
    }
    if (!state) {
      navigate("/students");
    }
  }, [loginStatus.isLoggedIn, navigate, state]);
  useEffect(() => {
    if ((state.belongsToUserId, state.studentId)) {
      const q = query(
        collection(
          db,
          "users",
          state.belongsToUserId,
          "students",
          state.studentId,
          "lessons"
        )
      );

      onSnapshot(q, (querySnapshot) => {
        const fetchedRooms: Room[] = [];
        querySnapshot.forEach((doc) => {
          const room: Room = {
            roomName: doc.data().roomName,
            id: doc.id,
            createdAt:
              doc.data().createdAt &&
              doc.data().createdAt.toDate &&
              doc.data().createdAt.toDate()
                ? doc.data().createdAt.toDate()
                : new Date(),
          };
          fetchedRooms.push(room);
        });

        setActiveRooms(fetchedRooms);
      });
    }
  }, [state.belongsToUserId, state.studentId]);

  const createRoom = async () => {
    if ((state.belongsToUserId, state.studentId)) {
      const roomsRef = collection(
        db,
        "users",
        state.belongsToUserId,
        "students",
        state.studentId,
        "lessons"
      );

      await addDoc(roomsRef, {
        roomName: newRoomName,
        createdAt: serverTimestamp(),
      });
    }
  };
  return (
    <div>
      <NavBar />
      <div className="pageContainer">
        <div className="newRoomContainer">
          {areYouAdmin && (
            <>
              <div className="titleNewLesson">New lesson </div>
              <div className="inputContainer">
                <Input
                  placeholder="Name"
                  onChange={(e) => setNewRoomName(e.target.value)}
                  icon={<PlusIcon />}
                  onClick={createRoom}
                />
              </div>
            </>
          )}
        </div>
        <div className="title">Lessons: </div>
        <div className="roomsListContainer">
          {activeRooms.map((lesson, index) => (
            <LessonItem
              key={index}
              belongsToUserId={state.belongsToUserId}
              studentId={state.studentId}
              lesson={lesson}
              customStyle={{ marginBottom: "10px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
