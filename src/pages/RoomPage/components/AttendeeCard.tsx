import React from "react";
import { Attendee } from "../../../types";
import styles from "./styles/AttendeeCard.module.css";

export default function AttendeeCard({ attendee }: { attendee: Attendee }) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.attendeeName}>{attendee.checkInName}</div>
    </div>
  );
}
