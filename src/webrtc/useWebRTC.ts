import {
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useWebRTC = (roomDoc: DocumentReference, state: any) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const localRef = useRef<HTMLVideoElement | null>(null);
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const attendeesDbRef = collection(roomDoc, "attendees");

  useEffect(() => {
    const peerCon = new RTCPeerConnection();

    const requestAudioAndVideo = async () => {
      try {
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
              peerCon.addTrack(track, stream);
            });
            const remoteStreamMedia = new MediaStream();
            peerCon.ontrack = (event) => {
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
              peerCon.onicecandidate = (event) => {
                event.candidate &&
                  setDoc(doc(offerCandidatesRef), event.candidate.toJSON());
              };

              const offerDescription = await peerCon.createOffer();
              await peerCon.setLocalDescription(offerDescription);
              const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
              };
              await setDoc(callDocRef, { offer });
              onSnapshot(callDocRef, (snapshot) => {
                const data = snapshot.data();
                if (!peerCon.currentRemoteDescription && data?.answer) {
                  const answerDescription = new RTCSessionDescription(
                    data.answer
                  );
                  peerCon.setRemoteDescription(answerDescription);
                }
              });
              onSnapshot(answerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                  if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    peerCon.addIceCandidate(candidate);
                  }
                });
              });
              console.log(peerCon);
              const dataChannel = peerCon.createDataChannel("chat");
              console.log("dataChannel", dataChannel);
              dataChannel.onopen = (event) => {
                console.log("DataChannel opened");
              };
              dataChannel.onmessage = (event) => {
                console.log("Received message:", event.data);
              };
            } else {
              const offerCandidatesRef = collection(
                callDocRef,
                "offerCandidates"
              );
              const answerCandidatesRef = collection(
                callDocRef,
                "answerCandidates"
              );
              peerCon.onicecandidate = (event) => {
                event.candidate &&
                  setDoc(doc(answerCandidatesRef), event.candidate.toJSON());
              };
              const callData = callDoc.data();
              const offerDescription = callData.offer;
              await peerCon.setRemoteDescription(
                new RTCSessionDescription(offerDescription)
              );
              const answerDescription = await peerCon.createAnswer();
              await peerCon.setLocalDescription(answerDescription);
              const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
              };
              await updateDoc(callDocRef, { answer });
              onSnapshot(offerCandidatesRef, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                  if (change.type === "added") {
                    let data = change.doc.data();
                    peerCon.addIceCandidate(new RTCIceCandidate(data));
                  }
                });
              });
            }
            peerCon.onconnectionstatechange = (event) => {
              if (peerCon.connectionState === "disconnected") {
                console.log(`disconnected`);
                hangUp();
              }
            };

            peerCon.ondatachannel = (event) => {
              const dataChannel = event.channel;
              dataChannel.onopen = (event) => {
                console.log("DataChannel opened");
              };
              dataChannel.onmessage = (event) => {
                console.log("Received message:", event.data);
              };
            };
          });
      } catch (error) {
        console.log("Error requesting audio and video:", error);
      }
    };

    requestAudioAndVideo();

    // Clean up when the component unmounts
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
      setPc(null);
      peerCon.close();
    };
  }, [roomDoc]);

  const navigate = useNavigate();
  const hangUp = async () => {
    if (pc) pc.close();

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

  return { localStream, remoteStream, isCameraOn, isMicrophoneOn, pc };
};

export default useWebRTC;
