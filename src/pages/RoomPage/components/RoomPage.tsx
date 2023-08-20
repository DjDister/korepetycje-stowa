import React from "react";
import styles from "./styles/RoomPage.module.css";
import { Attendee } from "../../../types";
import BottomMenu from "./BottomMenu";
import AttendeeCard from "./AttendeeCard";
import Grid from "@mui/material/Grid";

export default function RoomPageComponent({
  attendees,
  isMicrophoneOn,
  setIsMicrophoneOn,
  hangUp,
  roomName,
  isCameraOn,
  setIsCameraOn,
}: {
  attendees: Attendee[];
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (value: boolean) => void;
  hangUp: () => void;
  roomName: string;
  isCameraOn: boolean;
  setIsCameraOn: (value: boolean) => void;
}) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.attendeesContainer}>
          <Grid container spacing={8} direction={"row"}>
            {attendees.map((attendee, index) => (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <AttendeeCard attendee={attendee} />
              </Grid>
            ))}
          </Grid>
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
