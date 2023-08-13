import React from "react";
import styles from "./InformationCard.module.css";
export default function InformationCard({
  label,
  text,
  icon,
  customStyles,
  onClick,
  labelStyle,
  className,
}: {
  label: string;
  text: string;
  icon: JSX.Element;
  customStyles?: React.CSSProperties;
  onClick?: () => void;
  labelStyle?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`${styles.emailContainer} ${className}`}
      style={customStyles}
    >
      <div>
        <div style={labelStyle}>{label}</div>
        {text}
      </div>
      <div className={styles.icon} onClick={onClick}>
        {icon}
      </div>
    </div>
  );
}
