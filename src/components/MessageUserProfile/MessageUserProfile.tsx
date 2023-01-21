import React from "react";
import ArrowRight from "../Icons/ArrowRight";
import styles from "./MessageUserProfile.module.css";
export default function MessageUserProfile({
  iconUrl,
  name,
  message,
  customStyles,
  onClick,
}: {
  iconUrl: string;
  name: string;
  message: string;
  customStyles?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div className={styles.container} style={customStyles}>
      <div className={styles.wrapper}>
        <div className={styles.profileIcon}>
          <div className={styles.overflowHidden}>
            <img className={styles.icon} alt="profilePic" src={iconUrl} />
          </div>
        </div>
        <div className={styles.nameMessageContainer}>
          <div className={styles.nameLabel}>{name}</div>
          <div className={styles.messageLabel}>{message}</div>
        </div>
      </div>
      <div className={styles.iconContainer} onClick={onClick}>
        <ArrowRight />
      </div>
    </div>
  );
}
