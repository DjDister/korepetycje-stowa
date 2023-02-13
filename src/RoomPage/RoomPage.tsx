import { Excalidraw } from "@excalidraw/excalidraw";
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
import ArrowLeft from "../components/Icons/ArrowLeft";
import ArrowRight from "../components/Icons/ArrowRight";
import Door from "../components/Icons/Door";
import VideoCamera from "../components/Icons/VideoCamera";
import Input from "../components/Input/Input";
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

let pc = new RTCPeerConnection(servers);

export default function RoomPage() {
  //issue with joing a room second time - addtracks failed because the peerconnection was closed

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
  const [dataChannelActive, setDataChannelActive] =
    useState<RTCDataChannel | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [comingFromListen, setComingFromListen] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
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

      const dataChannel = pc.createDataChannel("messages");

      pc.ondatachannel = (event) => {
        const receiveDataChannel = event.channel;
        receiveDataChannel.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (excalidrawRef.current) {
            if (message.sendBy !== profile.uid) {
              // console.log(`recieve data`);
              // console.log(message.message);
              setComingFromListen(true);
              excalidrawRef.current.updateScene({
                elements: JSON.parse(message.message),
              });
            }
          }
        };
      };
      setDataChannelActive(dataChannel);
      if (dataChannel) {
        setShowWhiteboard(true);
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

    if (excalidrawRef.current) {
      const elements = excalidrawRef.current.getSceneElements();
      const data = JSON.stringify(elements);

      await setDoc(canvasDocReff, { canvas: data });
    }
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

  const sendMessage = (message: string) => {
    const messageData = {
      message,
      sendBy: profile.uid,
    };
    if (comingFromListen) {
      setComingFromListen(false);
      return;
    }
    if (pc.signalingState === "stable") {
      if (dataChannelActive) {
        if (dataChannelActive.readyState === "open") {
          dataChannelActive.send(JSON.stringify(messageData));
          console.log(`send data`);
        }
      }
    }
    // else {
    //   console.error("Cannot send message in current signaling state", pc);
    // }
  };

  const [hovering, setHovering] = useState(false);

  const canvasDocReff = doc(collection(roomDoc, "canvas"), "123");

  const [message, setMessage] = useState<string | null>(null);
  const [currentElements, setCurrentElements] = useState<ExcalidrawElement[]>(
    []
  );

  const handleChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {
    if (appState.cursorButton === "up") {
      if (areObjectsEqual(elements, currentElements)) {
        return;
      }
    } else {
      if (appState.activeTool.type === "hand") {
        return;
      }
    }
    setCurrentElements(elements as ExcalidrawElement[]);
    if (elements.length === 0) return;

    if (dataChannelActive) {
      sendMessage(JSON.stringify(elements));
    }
  };
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

  const [initialData, setInitialData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const getInitialData = async () => {
      const docSnap = await getDoc(canvasDocReff);
      if (docSnap.exists()) {
        setInitialData(docSnap.data());
      }
    };

    if (!isMounted) {
      getInitialData();
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.whiteboardContainer}>
        <div
          style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            backgroundColor: "yellow",
            zIndex: 0,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Input
              style={{
                zIndex: 1222,
                position: "absolute",
                top: 200,
                right: 0,
                width: "40%",
              }}
              placeholder="mess"
              onChange={(e) => setMessage(e.target.value)}
              icon={<ArrowRight />}
              onClick={() => {
                if (message) {
                  sendMessage(message);
                }
              }}
            />
            {showWhiteboard ? (
              <Excalidraw
                ref={excalidrawRef}
                initialData={{ elements: JSON.parse(initialData.canvas) }}
                onChange={handleChange}
                isCollaborating={true}
              />
            ) : null}
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
