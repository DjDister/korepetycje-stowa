import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebaseConfig";
import { useAppSelector } from "./redux/hooks";

type Atendee = {
  checkInName: string;
  userId: string;
  rank: string;
  accepted: string;
};

export default function RoomPage() {
  const [areYouAdmin, setAreYouAdmin] = useState(false);
  const [attendees, setAttendees] = useState<Atendee[]>([]);
  const state = useLocation();
  const navigate = useNavigate();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const hostId = state.pathname.substring(6, 34);
  const roomId = state.pathname.substring(35, 55);

  console.log(attendees);

  // const unsub = onSnapshot(doc(db, "users", hostId, "rooms", roomId), (doc) => {
  //   console.log("Current data: ", doc.data());
  // }); // Listen for document metadata changes
  useEffect(() => {
    if (!loginStatus.isLoggedIn) {
      navigate("/login");
    } else {
      setAreYouAdmin(hostId === loginStatus.user?.uid);
      const fetchAtendees = async () => {
        const q = query(
          collection(db, "users", hostId, "rooms", roomId, "attendees")
        );

        const querySnapshot = await getDocs(q);
        const fetchAtendees: Atendee[] = [];
        querySnapshot.forEach((doc) => {
          const atendee = doc.data() as Atendee;
          fetchAtendees.push(atendee);
        }, []);
        setAttendees(fetchAtendees);
      };
      fetchAtendees();
    }
  }, []);

  const acceptUser = async (atendee: Atendee) => {
    console.log(`tt`);
    console.log(atendee.userId);
    const q = query(
      collection(db, "users", hostId, "rooms", roomId, "attendees"),
      where("userId", "==", atendee.userId)
    );
    const querySnapshot = await getDocs(q);

    const fetchAtendees: Atendee[] = [];
    querySnapshot.forEach(async (doc) => {
      console.log(doc.data());
      const atendee = doc.data() as Atendee;
      fetchAtendees.push(atendee);
      await setDoc(doc.ref, { ...atendee, accepted: "true" });
    }, []);
    setAttendees((prev) => [
      ...prev.filter((attendee) => attendee.userId !== atendee.userId),
      { ...fetchAtendees[0], accepted: "true" },
    ]);
  };

  const removeUser = async (atendee: Atendee) => {
    if (areYouAdmin) {
      const q = query(
        collection(db, "users", hostId, "rooms", roomId, "attendees"),
        where("userId", "==", atendee.userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      }, []);
      setAttendees(
        attendees.filter((attendee) => attendee.userId !== atendee.userId)
      );
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div>RoomPage</div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ width: "70%", height: "70vh", backgroundColor: "grey" }}
        ></div>
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <div
            style={{
              width: "100%",
              height: "20vh",
              backgroundColor: "greenyellow",
            }}
          >
            Cam1
          </div>
          <div
            style={{ width: "100%", height: "20vh", backgroundColor: "yellow" }}
          >
            Cam2
          </div>
        </div>
      </div>
      <div>
        {attendees
          .filter((atendee) => atendee.accepted === "true")
          .map((atendee, index) => (
            <div key={index} style={{ display: "flex" }}>
              <div
                style={
                  atendee.userId === loginStatus.user?.uid
                    ? { color: "green" }
                    : {}
                }
              >
                {atendee.checkInName}
              </div>{" "}
              {atendee.rank}
            </div>
          ))}
      </div>
      <div>
        Pedning to join:
        {attendees
          .filter((atendee) => atendee.accepted === "false")
          .map((atendee, index) => (
            <div key={index} style={{ display: "flex" }}>
              <div
                style={
                  atendee.userId === loginStatus.user?.uid
                    ? { color: "green" }
                    : {}
                }
              >
                {atendee.checkInName}
              </div>{" "}
              {atendee.rank}
              {areYouAdmin ? (
                <>
                  <div
                    style={{ width: 100, backgroundColor: "green" }}
                    onClick={() => acceptUser(atendee)}
                  >
                    Accept
                  </div>
                  <div onClick={() => removeUser(atendee)}>remove </div>
                </>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
}
