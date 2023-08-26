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

const pc = new RTCPeerConnection(servers);

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
    const requestAudioAndVideo = async () => {
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
          const callDocRef = doc(roomDoc, "calls", "call1");
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

  const navigate = useNavigate();
  const hangUp = async () => {
    pc.close();

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
  return (
    <div>
      <RoomPageComponent
        localStream={localStream}
        remoteStream={remoteStream}
        attendees={attendees}
        isMicrophoneOn={isMicrophoneOn}
        setIsMicrophoneOn={onMicrophoneClick}
        hangUp={hangUp}
        roomName={state.state.lesson.roomName}
        isCameraOn={isCameraOn}
        setIsCameraOn={handleCameraClick}
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
