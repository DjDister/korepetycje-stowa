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
import { useLocation, useNavigate } from "react-router-dom";
import ArrowLeft from "../components/Icons/ArrowLeft";
import Door from "../components/Icons/Door";
import VideoCamera from "../components/Icons/VideoCamera";
import { db } from "../firebaseConfig";
import { useAppSelector } from "../redux/hooks";
import servers from "../webRTCConfig";
import styles from "./RoomPage.module.css";
type Atendee = {
  checkInName: string;
  userId: string;
  rank: string;
  accepted: string;
};

const pc = new RTCPeerConnection(servers);

export default function RoomPage() {
  //issue with joing a room second time - addtracks failed because the peerconnection was closed

  const [attendees, setAttendees] = useState<Atendee[]>([]);
  const [otherUser, setOtherUser] = useState<Atendee | undefined>(undefined);
  const state = useLocation();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const hostId = state.pathname.substring(6, 34);
  const roomId = state.pathname.substring(35, 55);
  const isAdmin = hostId === loginStatus.user?.uid;

  const roomDoc = doc(
    db,
    "users",
    state.state.belongsToUserId,
    "students",
    state.state.studentId,
    "lessons",
    state.state.lesson.id
  );
  const callDoc = doc(roomDoc, "calls", roomId);
  const answerCandidates = collection(callDoc, "answerCandidates");
  const offerCandidates = collection(callDoc, "offerCandidates");
  const attendeesDbRef = collection(roomDoc, "attendees");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOtherUser(attendees.find((a) => a.userId !== loginStatus.user?.uid));
  }, [attendees, loginStatus.user?.uid]);

  const [webcamActive, setWebcamActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
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
    setLocalStream(localStream);
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    if (localRef.current && remoteRef.current) {
      localRef.current.srcObject = localStream;
      remoteRef.current.srcObject = remoteStream;
    }
    setWebcamActive(true);

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
  const navigate = useNavigate();
  const hangUp = async () => {
    pc.close();
    if (localRef.current) localRef.current.srcObject = null;
    localStream?.getTracks().forEach((track) => track.stop());
    setWebcamActive(false);
    await deleteDoc(callDoc);
    await deleteDoc(doc(attendeesDbRef, state.state.yourAttendeeId));
    navigate(`/lessons`, {
      state: {
        studentId: state.state.studentId,
        belongsToUserId: state.state.belongsToUserId,
        refresh: true,
      },
    });
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

  const [hovering, setHovering] = useState(false);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.whiteboardContainer}>
        <div className={styles.roomDetailsContainer}>
          <div className={styles.leaveButton} onClick={hangUp}>
            <ArrowLeft />
          </div>
          <div className={styles.roomNameConatiner}>{state.state.roomName}</div>
        </div>

        <div className={styles.yourCameraContainer}>
          <div
            className={styles.cameraRelativeContainer}
            onMouseEnter={webcamActive ? () => setHovering(true) : undefined}
            onMouseLeave={webcamActive ? () => setHovering(false) : undefined}
          >
            <div className={styles.nameTagCamera}>
              {state.state.checkInName}
            </div>
            <video
              className={styles.video}
              ref={localRef}
              autoPlay
              playsInline
            ></video>
            {webcamActive ? (
              hovering ? (
                <div
                  style={
                    hovering
                      ? {
                          zIndex: 2,
                          position: "absolute",
                          backgroundColor: "white",
                          opacity: 0.5,
                          left: 0,
                          top: 0,
                          right: 0,
                          bottom: 0,
                        }
                      : {}
                  }
                >
                  <div className={styles.joinButtonContainer} onClick={hangUp}>
                    <Door />
                  </div>
                </div>
              ) : null
            ) : (
              <div
                className={styles.joinButtonContainer}
                onClick={setupSources}
              >
                <VideoCamera />
              </div>
            )}
          </div>
        </div>
        <div className={styles.otherUserCameraContainer}>
          <div className={styles.cameraRelativeContainer}>
            <div className={styles.nameTagCamera}>
              {otherUser?.checkInName ?? "Waiting for other user"}
            </div>
            <video
              className={styles.video}
              ref={remoteRef}
              autoPlay
              playsInline
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}
