import styles from "./SubjectCard.module.css";

export default function SubjectCard({
  Customstyles,
  subjectName,
  subjectIcon,
}: {
  Customstyles?: React.CSSProperties;
  subjectName: string;
  subjectIcon?: JSX.Element;
}) {
  return (
    <div className={styles.subCard}>
      <div className={styles.subIcon}>{subjectIcon}</div>
      <div className={styles.subName}>{subjectName}</div>
    </div>
  );
}
