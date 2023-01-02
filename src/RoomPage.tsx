import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "./firebaseConfig";
import { useAppSelector } from "./redux/hooks";
import servers from "./webRTCConfig";

type Atendee = {
  checkInName: string;
  userId: string;
  rank: string;
  accepted: string;
};

const pc = new RTCPeerConnection(servers);

export default function RoomPage() {
  const [attendees, setAttendees] = useState<Atendee[]>([]);
  const state = useLocation();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const hostId = state.pathname.substring(6, 34);
  const roomId = state.pathname.substring(35, 55);
  const isAdmin = hostId === loginStatus.user?.uid;
  const callDoc = doc(db, "users", hostId, "rooms", roomId, "calls", roomId);
  const answerCandidates = collection(callDoc, "answerCandidates");
  const offerCandidates = collection(callDoc, "offerCandidates");
  const attendeesDbRef = collection(
    db,
    "users",
    hostId,
    "rooms",
    roomId,
    "attendees"
  );
  useEffect(() => {
    const q = query(attendeesDbRef);
    onSnapshot(q, (querySnapshot) => {
      const fetchAtendees: Atendee[] = [];
      querySnapshot.forEach((doc) => {
        const atendee = doc.data() as Atendee;

        fetchAtendees.push(atendee);
      }, []);
      setAttendees(fetchAtendees);
    });
  }, []);

  const [webcamActive, setWebcamActive] = useState(false);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    const remoteStream = new MediaStream();
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    if (localRef.current && remoteRef.current) {
      localRef.current.srcObject = localStream;
      remoteRef.current.srcObject = remoteStream;
      setWebcamActive(true);
    }

    if (isAdmin) {
      pc.onicecandidate = (event) => {
        event.candidate &&
          setDoc(doc(offerCandidates), event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDoc, offer);

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    } else {
      pc.onicecandidate = (event) => {
        event.candidate &&
          setDoc(doc(answerCandidates), event.candidate.toJSON());
      };

      const callData = (await getDoc(callDoc)).data();
      const offerDescription = callData as RTCSessionDescription;

      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(callDoc, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }
  };

  const hangUp = async () => {
    pc.close();

    await deleteDoc(callDoc);
  };

  pc.onconnectionstatechange = (event) => {
    if (pc.connectionState === "disconnected") {
      hangUp();
    }
  };

  const acceptUser = async (atendee: Atendee) => {
    const q = query(attendeesDbRef, where("userId", "==", atendee.userId));
    const querySnapshot = await getDocs(q);

    const fetchAtendees: Atendee[] = [];
    querySnapshot.forEach(async (doc) => {
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
    if (isAdmin) {
      const q = query(attendeesDbRef, where("userId", "==", atendee.userId));
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
      <div>RoomPage {state.state.roomName}</div>
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
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <video
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                ref={localRef}
                autoPlay
                playsInline
              ></video>
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  zIndex: 10,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                {state.state.checkInName}
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "20vh",
              backgroundColor: "greenyellow",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              <video
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                ref={remoteRef}
                autoPlay
                playsInline
              ></video>
              <div
                style={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  zIndex: 10,
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                other
              </div>
            </div>
          </div>
        </div>
      </div>
      <div onClick={setupSources}> setup</div>
      <div onClick={hangUp}>hangup</div>
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
              {isAdmin ? (
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
