import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";

export const initLocalStream = async () => {
  try {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });

    return localStream;
  } catch (error) {
    console.log(error);
  }
};

export const initConnection = async () => {
  const configuration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
  const connection = new RTCPeerConnection(configuration);

  //   localStream.getTracks().forEach((track) => {
  //     connection.addTrack(track, localStream);
  //   });

  return connection;
};

export const listenToConnection = (
  connection: RTCPeerConnection,
  userId: string,
  //   remoteUserId: string,
  remoteVideoRef: React.RefObject<HTMLVideoElement>
) => {
  connection.onicecandidate = (event) => {
    if (event.candidate) {
      //   console.log("candidate", event.candidate);
    }
  };

  connection.ontrack = (event) => {
    // console.log("track", event);
    if (
      remoteVideoRef.current &&
      remoteVideoRef.current?.srcObject !== event.streams[0]
    ) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  //   connection.oniceconnectionstatechange = (event) => {
  //     console.log("iceconnectionstatechange", event);
  //   };

  //   connection.onicegatheringstatechange = (event) => {
  //     console.log("icegatheringstatechange", event);
  //   };

  //   connection.onsignalingstatechange = (event) => {
  //     console.log("signalingstatechange", event);
  //   };
};
type Atendee = {
  checkInName: string;
  userId: string;
  rank: string;
  accepted: string;
};
export const doOffer = async (
  hostId: string,
  userId: string,
  roomId: string,
  remoteUserId: string,
  db: Firestore,
  offer: RTCSessionDescriptionInit
) => {
  const q = query(
    collection(db, "users", hostId, "rooms", roomId, "attendees")
  );

  const querySnapshot = await getDocs(q);
  console.log(`creatingssssaaasssassdoafaser`);
  querySnapshot.forEach(async (doc) => {
    const atendee = doc.data() as Atendee;
    if (atendee.userId === remoteUserId) {
      await addDoc(collection(doc.ref, "offer"), {
        type: "offer",
        from: userId,
        offer: JSON.stringify(offer),
      });
    }
  }, []);
};

export const createOfer = async (
  localStream: MediaStream,
  connection: RTCPeerConnection
  //   userId: string,
  //   remoteUserId: string,
  //   roomId: string,
  //   db: Firestore
) => {
  try {
    console.log(`tryign to create offer`);
    for (const track of localStream.getTracks()) {
      connection.addTrack(track, localStream);
    }

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    return offer;
  } catch (error) {
    console.log(error);
  }
};
