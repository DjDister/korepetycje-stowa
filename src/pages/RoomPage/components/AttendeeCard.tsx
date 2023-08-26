import React, { useEffect, useRef } from "react";
import { Attendee } from "../../../types";
import styles from "./styles/AttendeeCard.module.css";
import MicrophoneOff from "../../../components/Icons/MicrophoneOff";

export default function AttendeeCard({
  attendee,
  style,
  stream,
}: {
  attendee: Attendee;
  style?: React.CSSProperties;
  stream?: MediaStream | undefined;
}) {
  const streamRef = useRef<HTMLVideoElement | null>(null);

  const setStreamSrcObject = (
    videoElement: HTMLVideoElement | null,
    stream: MediaStream | undefined
  ) => {
    if (videoElement && stream) {
      videoElement.srcObject = stream;
    }
  };

  useEffect(() => {
    if (stream) {
      setStreamSrcObject(streamRef.current, stream);
    }
  }, [stream]);

  return (
    <div className={styles.cardContainer} style={style}>
      {!attendee.audio && (
        <div className={styles.microOff}>
          <MicrophoneOff size={20} />
        </div>
      )}
      {attendee.video ? (
        <>
          <video
            ref={(element) => setStreamSrcObject(element, stream)}
            autoPlay
            playsInline
            className={styles.video}
          />
        </>
      ) : (
        <div className={styles.iconContainer}>{attendee.userName[0]}</div>
      )}
      <div className={styles.attendeeName}>{attendee.userName}</div>
    </div>
  );
}
