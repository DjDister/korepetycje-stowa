import React from "react";
import MicrophoneOff from "../../../components/Icons/MicrophoneOff";
import MicrophoneOn from "../../../components/Icons/MicrophoneOn";
import styles from "./styles/BottomMenu.module.css";
import { VideocamOff, Videocam, CallEnd, NoteAlt } from "@mui/icons-material";
export default function BottomMenu({
  isMicrophoneOn,
  setIsMicrophoneOn,
  hangUp,
  roomName,
  isCameraOn,
  setIsCameraOn,
  setIsWhiteBoardOn,
  isWhiteBoardOn,
}: {
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (value: boolean) => void;
  hangUp: () => void;
  roomName: string;
  isCameraOn: boolean;
  setIsCameraOn: (value: boolean) => void;
  setIsWhiteBoardOn: (value: boolean) => void;
  isWhiteBoardOn: boolean;
}) {
  const renderIcon = ({
    isOn,
    onPress,
    iconOn,
    iconOff,
  }: {
    isOn: boolean;
    onPress: () => void;
    iconOn?: JSX.Element;
    iconOff?: JSX.Element;
  }) => {
    return (
      <div
        className={styles.circleButton}
        style={{
          backgroundColor: isOn ? "#3c4043" : "#e64535",
        }}
        onClick={onPress}
      >
        {isOn && iconOff ? iconOn : iconOff}
      </div>
    );
  };

  return (
    <div className={styles.bottomMenuContainer}>
      <div className={styles.leftOptions}>
        <div className={styles.roomName}>{roomName}</div>
      </div>
      <div className={styles.middleOptions}>
        {renderIcon({
          isOn: isMicrophoneOn,
          onPress: () => setIsMicrophoneOn(!isMicrophoneOn),
          iconOn: <MicrophoneOn />,
          iconOff: <MicrophoneOff />,
        })}
        {renderIcon({
          isOn: isCameraOn,
          onPress: () => setIsCameraOn(!isCameraOn),
          iconOn: <Videocam htmlColor="white" />,
          iconOff: <VideocamOff htmlColor="white" />,
        })}
        {renderIcon({
          isOn: isWhiteBoardOn,
          onPress: () => setIsWhiteBoardOn(!isWhiteBoardOn),
          iconOff: <NoteAlt htmlColor="white" />,
          iconOn: <NoteAlt htmlColor="white" />,
        })}
        {renderIcon({
          isOn: false,
          onPress: hangUp,
          iconOff: <CallEnd htmlColor="white" />,
        })}
      </div>
      <div className={styles.rightOptions}></div>
    </div>
  );
}
