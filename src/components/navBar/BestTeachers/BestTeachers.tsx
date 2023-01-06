import styless from "./SubjectCard.module.css";

import styles from "./BestTeachers.module.css";

export default function BestTeachers({
  customStyles,
  rating,
  name,
  subject,
  picture,
  numOfStudents,
}: {
  customStyles?: React.CSSProperties;
  rating?: number;
  name: string;
  subject: string;
  numOfStudents?: number;
  picture?: JSX.Element;
}) {
  return (
    <div className={styles.topTeacherCard}>
      <div className={styles.pictureAndName}>
        <div className={styles.picture}>{picture}</div>
        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.statistics}>
        <div className={styles.stat}>Przedmiot : {subject}</div>
        <div className={styles.stat}>Liczba uczniów : {numOfStudents}</div>
        <div className={styles.stat}>Ocena : {rating} / 5</div>
        <div className={styles.contact}>Kontakt</div>
      </div>
    </div>
  );
}
