import React from "react";
import styles from "./ProfileCard.module.css";

export default function ProfileCard(profile: any) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.iconSpacer}>
          <img src={"https://picsum.photos/200"} />
        </div>
      </div>
      <div className={styles.dataContainer}>
        <div>Imię: {profile.name}</div>
        <div>Nazwisko: {profile.surname}</div>
      </div>
    </div>
  );
}
