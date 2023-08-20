import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { useAppSelector } from "../../../redux/hooks";
import servers from "../../../webRTCConfig";
import { Attendee } from "../../../types";
import RoomPageComponent from "../components/RoomPage";

export default function RoomPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [otherUser, setOtherUser] = useState<Attendee | undefined>(undefined);
  const state = useLocation();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const roomId = state.pathname.substring(35, 55);
  const { profile } = useAppSelector((state) => state.profile);
  const roomDoc = doc(
    db,
    "users",
    state.state.belongsToUserId,
    "students",
    state.state.studentId,
    "lessons",
    state.state.lesson.id
  );
  const attendeesDbRef = collection(roomDoc, "attendees");
  useEffect(() => {
    const q = query(attendeesDbRef);
    onSnapshot(q, (querySnapshot) => {
      const fetchAtendees: Attendee[] = [];
      querySnapshot.forEach((doc) => {
        const atendee = doc.data() as Attendee;

        fetchAtendees.push(atendee);
      }, []);

      setAttendees(fetchAtendees);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const hangUp = async () => {
    await deleteDoc(doc(attendeesDbRef, state.state.yourAttendeeId));

    navigate(`/lessons`, {
      state: {
        studentId: state.state.studentId,
        belongsToUserId: state.state.belongsToUserId,
        refresh: true,
      },
    });
  };

  return (
    <RoomPageComponent
      attendees={attendees}
      isMicrophoneOn={isMicrophoneOn}
      setIsMicrophoneOn={setIsMicrophoneOn}
      hangUp={hangUp}
      roomName={state.state.lesson.roomName}
      isCameraOn={isCameraOn}
      setIsCameraOn={setIsCameraOn}
    />
  );
}
export function areObjectsEqual(object1: any, object2: any) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !areObjectsEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}

function isObject(object: any) {
  return object != null && typeof object === "object";
}
