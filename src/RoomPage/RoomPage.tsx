import {
  addDoc,
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
import CanvasDraw from "react-canvas-draw";
type Atendee = {
  checkInName: string;
  userId: string;
  rank: string;
  accepted: string;
};

let pc = new RTCPeerConnection(servers);

export default function RoomPage() {
  //issue with joing a room second time - addtracks failed because the peerconnection was closed
  //todo: as a student send yours whiteboard which you edited and load it on teacher's screen
  const [attendees, setAttendees] = useState<Atendee[]>([]);
  const [otherUser, setOtherUser] = useState<Atendee | undefined>(undefined);
  const state = useLocation();
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const hostId = state.pathname.substring(6, 34);
  const roomId = state.pathname.substring(35, 55);
  const isAdmin = hostId === loginStatus.user?.uid;
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
    if (pc.signalingState === "closed") {
      pc.close();
      pc = new RTCPeerConnection();
    }
    try {
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
    } catch (e: any) {
      if (e.name === "NotFoundError") {
        alert("Requested device not found.");
      } else {
        console.error("Error occurred while accessing user media devices", e);
      }
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

  const canvasRef = useRef<any>(null);
  const canvasCollection = collection(roomDoc, "canvas");
  const canvasDocReff = doc(collection(roomDoc, "canvas"), "123");
  const canvasDocRef = doc(collection(roomDoc, "canvas"), "123");
  const saveCanvas = async () => {
    console.log(`saving canvas`);
    const data = canvasRef.current.getSaveData();

    setLines([...JSON.parse(data).lines]);
    await setDoc(canvasDocReff, JSON.parse(data))
      .then((docRef) => {
        console.log("Document written with ");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  useEffect(() => {
    if (profile.type === "student") {
      onSnapshot(canvasDocReff, (doc) => {
        let newestDoc: any = doc.data();
        // snapshot.docChanges().forEach((change) => {
        //   if (change.type === "added") {
        //     newestDoc = change.doc;
        //   }
        // });
        if (newestDoc) {
          console.log(`newest canvas data detected`);

          const data = doc.data();

          const currentData = canvasRef.current.getSaveData();

          const currentCanvas = JSON.parse(currentData);
          const newCanvas = JSON.parse(JSON.stringify(data));
          currentCanvas.lines = currentCanvas.lines.concat(newCanvas.lines);
          canvasRef.current.loadSaveData(JSON.stringify(currentCanvas), true);
        }
      });
    }
  }, []);
  const [lines, setLines] = useState<any[]>([]);
  console.log(lines);
  // //const canvasRef = React.createRef<CanvasDraw>();

  // useEffect(() => {
  //   // Listen to changes in the lines data in the database
  //   // and update the state with the latest lines
  //   onSnapshot(canvasDocRef, (snapshot) => {
  //     setLines(snapshot.data()?.lines);
  //   });
  // }, []);

  // // Handle new line added
  // const handleLineAdded = (newLine: any) => {
  //   setLines((prevLines) => {
  //     // Update the state with the new line
  //     const updatedLines = [...prevLines, newLine];

  //     // Save the updated lines to the database
  //     setDoc(canvasDocRef, { lines: updatedLines });

  //     return updatedLines;
  //   });
  // };

  // const [lines, setLines] = useState([]);

  // useEffect(() => {
  //   if (profile.type === "student") {
  //     onSnapshot(canvasDocRef, (doc) => {
  //       const data = doc.data();
  //       console.log(`detected canvas data change in db`);
  //       console.log(data);
  //       canvasRef.current.loadSaveData(JSON.stringify(data));
  //     });
  //   }
  // }, []);

  // const handleDraw = async (saveData: any) => {
  //   console.log(`saving canvas`);
  //   console.log(saveData);
  //   const doc = await getDoc(canvasDocRef);
  //   if (!doc.exists) {
  //     console.log(`doesnt exist`);
  //   } else {
  //     console.log(`exists`);
  //     try {
  //       const data = canvasRef.current.getSaveData();
  //       await setDoc(canvasDocRef, JSON.parse(data));
  //       await updateDoc(canvasDocRef, {
  //         lines: saveData.lines,
  //       });
  //     } catch (error) {
  //       console.error("Error saving canvas: ", error);
  //     }
  //   }
  // };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.whiteboardContainer}>
        <div
          style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            backgroundColor: "yellow",
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* <CanvasDraw
              brushRadius={2}
              lazyRadius={0}
              canvasWidth={400}
              canvasHeight={400}
              //saveData={lines ? JSON.stringify(lines) : undefined}
              onChange={handleDraw}
              style={{ width: "100%", height: "100%" }}
            /> */}
            {/* <CanvasDraw
              ref={canvasRef}
              lazyRadius={0}
              brushRadius={2}
              brushColor="#444"
              hideGrid={true}
              saveData={JSON.stringify(lines)}
              onChange={handleLineAdded}
              style={{ width: "100%", height: "100%" }}
            /> */}
            <CanvasDraw
              onChange={
                profile.type === "student"
                  ? undefined
                  : (e) => {
                      saveCanvas();
                    }
              }
              ref={(canvasDraw) => (canvasRef.current = canvasDraw)}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
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
