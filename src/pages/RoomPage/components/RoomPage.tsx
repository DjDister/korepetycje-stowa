import React from "react";
import styles from "./styles/RoomPage.module.css";
import { Attendee } from "../../../types";
import BottomMenu from "./BottomMenu";
import AttendeeCard from "./AttendeeCard";
import { useAppSelector } from "../../../redux/hooks";
import WhiteBoard from "./WhiteBoard";

export default function RoomPageComponent({
  attendees,
  isMicrophoneOn,
  setIsMicrophoneOn,
  hangUp,
  roomName,
  isCameraOn,
  setIsCameraOn,
  localStream,
  remoteStream,
  setIsWhiteBoardOn,
  isWhiteBoardOn,
  sendMessageCallback,
  pc,
  dataChannel,
  receivedMessages,
}: {
  attendees: Attendee[];
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (value: boolean) => void;
  hangUp: () => void;
  roomName: string;
  isCameraOn: boolean;
  setIsCameraOn: (value: boolean) => void;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  setIsWhiteBoardOn: (value: boolean) => void;
  isWhiteBoardOn: boolean;
  sendMessageCallback: (message: any) => void;
  pc: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  receivedMessages: string;
}) {
  const { profile } = useAppSelector((state) => state.profile);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div
          className={styles.topContainer}
          style={isWhiteBoardOn ? { gap: 10 } : {}}
        >
          {isWhiteBoardOn && (
            <div />
            // <WhiteBoard
            //   receivedMessages={receivedMessages}
            //   pc={pc}
            //   dataChannel={dataChannel}
            // />
          )}
          <div
            className={styles.attendeesContainer}
            style={
              isWhiteBoardOn ? { height: "100%", flexDirection: "column" } : {}
            }
          >
            {attendees.map((attendee, index) => {
              return profile.displayName === attendee.userName ? (
                <AttendeeCard
                  key={index}
                  attendee={attendee}
                  stream={localStream}
                />
              ) : (
                <AttendeeCard
                  key={index}
                  attendee={attendee}
                  stream={remoteStream}
                />
              );
            })}
          </div>
        </div>
        <BottomMenu
          isMicrophoneOn={isMicrophoneOn}
          setIsMicrophoneOn={setIsMicrophoneOn}
          hangUp={hangUp}
          roomName={roomName}
          isCameraOn={isCameraOn}
          setIsCameraOn={setIsCameraOn}
          isWhiteBoardOn={isWhiteBoardOn}
          setIsWhiteBoardOn={setIsWhiteBoardOn}
        />
      </div>
    </div>
  );
}
