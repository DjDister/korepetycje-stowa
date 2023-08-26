import React from "react";
import styles from "./styles/RoomPage.module.css";
import { Attendee } from "../../../types";
import BottomMenu from "./BottomMenu";
import AttendeeCard from "./AttendeeCard";
import { useAppSelector } from "../../../redux/hooks";

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
}) {
  const { profile } = useAppSelector((state) => state.profile);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.attendeesContainer}>
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
        />
      </div>
    </div>
  );
}
