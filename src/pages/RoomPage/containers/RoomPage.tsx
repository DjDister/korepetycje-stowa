import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawAPIRefValue,
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

let pc = new RTCPeerConnection(servers);

export default function RoomPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined
  );
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(
    undefined
  );
  const state = useLocation();
  const localRef = useRef<HTMLVideoElement | null>(null);
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<string>("");
  const navigate = useNavigate();
  const [isWhiteBoardOn, setIsWhiteBoardOn] = useState(false);
  const roomId = state.pathname.substring(35, 55);
  const { profile } = useAppSelector((state) => state.profile);
  const [dataChannelActive, setDataChannelActive] =
    useState<RTCDataChannel | null>(null);
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
  const callDocRef = doc(roomDoc, "calls", "call1");
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);

  useEffect(() => {
    const requestAudioAndVideo = async () => {
      if (pc.signalingState === "closed") {
        pc.close();
        pc = new RTCPeerConnection();
      }
      await navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then(async (stream) => {
          stream.getVideoTracks()[0].enabled = false;
          const videoTrack = stream.getVideoTracks()[0];
          const audioTrack = stream.getAudioTracks()[0];
          if (videoTrack.enabled) setIsCameraOn(true);
          if (audioTrack.enabled) setIsMicrophoneOn(true);
          setLocalStream(stream);
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
          const remoteStreamMedia = new MediaStream();
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
            console.log(`dsadasd`);
          }
          pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
              remoteStreamMedia.addTrack(track);
              setRemoteStream(remoteStreamMedia);
            });
          };
          if (localRef.current) {
            localRef.current.srcObject = stream;
          }
          if (remoteRef.current)
            remoteRef.current.srcObject = remoteStreamMedia;

          const callDoc = await getDoc(callDocRef);
          if (!callDoc.exists()) {
            const offerCandidatesRef = collection(
              callDocRef,
              "offerCandidates"
            );
            const answerCandidatesRef = collection(
              callDocRef,
              "answerCandidates"
            );
            pc.onicecandidate = (event) => {
              event.candidate &&
                setDoc(doc(offerCandidatesRef), event.candidate.toJSON());
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);
            const offer = {
              sdp: offerDescription.sdp,
              type: offerDescription.type,
            };
            await setDoc(callDocRef, { offer });
            onSnapshot(callDocRef, (snapshot) => {
              const data = snapshot.data();
              if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                  data.answer
                );
                pc.setRemoteDescription(answerDescription);
              }
            });
            onSnapshot(answerCandidatesRef, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  const candidate = new RTCIceCandidate(change.doc.data());
                  pc.addIceCandidate(candidate);
                }
              });
            });
          } else {
            const offerCandidatesRef = collection(
              callDocRef,
              "offerCandidates"
            );
            const answerCandidatesRef = collection(
              callDocRef,
              "answerCandidates"
            );
            pc.onicecandidate = (event) => {
              event.candidate &&
                setDoc(doc(answerCandidatesRef), event.candidate.toJSON());
            };
            const callData = callDoc.data();
            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
              new RTCSessionDescription(offerDescription)
            );
            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);
            const answer = {
              type: answerDescription.type,
              sdp: answerDescription.sdp,
            };
            await updateDoc(callDocRef, { answer });
            onSnapshot(offerCandidatesRef, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                  let data = change.doc.data();
                  pc.addIceCandidate(new RTCIceCandidate(data));
                }
              });
            });
          }
          pc.onconnectionstatechange = (event) => {
            if (pc.connectionState === "disconnected") {
              console.log(`disconnected`);
              hangUp();
            }
          };
        })
        .catch((err) => {
          console.log(`err`, err);
        });
    };
    requestAudioAndVideo();
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
  console.log(dataChannelActive);
  const hangUp = async () => {
    pc.close();
    if (localRef.current) localRef.current.srcObject = null;
    localStream?.getTracks().forEach((track) => track.stop());

    if (remoteRef.current) remoteRef.current.srcObject = null;
    remoteStream?.getTracks().forEach((track) => track.stop());
    await deleteDoc(callDocRef);
    await deleteDoc(doc(attendeesDbRef, state.state.yourAttendeeId));

    navigate(`/lessons`, {
      state: {
        studentId: state.state.studentId,
        belongsToUserId: state.state.belongsToUserId,
        refresh: true,
      },
    });
    window.location.reload();
  };

  useEffect(() => {
    updateDoc(doc(attendeesDbRef, state.state.yourAttendeeId), {
      audio: isMicrophoneOn,
      video: isCameraOn,
    });
  }, [attendeesDbRef, isCameraOn, isMicrophoneOn, state.state.yourAttendeeId]);

  const onMicrophoneClick = async () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setIsMicrophoneOn(audioTrack.enabled);
  };

  const handleCameraClick = async () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOn(videoTrack.enabled);
  };
  const [comingFromListen, setComingFromListen] = useState(false);

  const sendMessage = (message: string) => {
    const messageData = {
      message,
      sendBy: profile.uid,
    };
    if (comingFromListen) {
      setComingFromListen(false);
      return;
    }
    console.log(`send data`);
    if (pc.signalingState === "stable") {
      if (dataChannelActive) {
        if (dataChannelActive.readyState === "open") {
          dataChannelActive.send(JSON.stringify(messageData));
          console.log("message sent");
        }
      }
    }
  };
  const [currentElements, setCurrentElements] = useState<ExcalidrawElement[]>(
    []
  );
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawAPIRefValue | null>(null);
  const sendMessageCallback = (message: any) => {
    console.log(message);
  };
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

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 10,
        }}
      >
        <Excalidraw
          ref={excalidrawRef}
          //initialData={{ elements: JSON.parse(initialData ?? "[]") }}
          onChange={handleChange}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              toggleTheme: null,
              saveAsImage: false,
            },
          }}
        ></Excalidraw>
      </div>
      <RoomPageComponent
        pc={pc}
        localStream={localStream}
        remoteStream={remoteStream}
        attendees={attendees}
        isMicrophoneOn={isMicrophoneOn}
        setIsMicrophoneOn={onMicrophoneClick}
        hangUp={hangUp}
        roomName={state.state.lesson.roomName}
        isCameraOn={isCameraOn}
        setIsCameraOn={handleCameraClick}
        isWhiteBoardOn={isWhiteBoardOn}
        setIsWhiteBoardOn={setIsWhiteBoardOn}
        sendMessageCallback={sendMessageCallback}
        dataChannel={dataChannelActive}
        receivedMessages={receivedMessages}
      />
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
