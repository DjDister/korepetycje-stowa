import React from "react";
import styles from "./Input.module.css";
export default function Input({
  icon,
  placeholder,
  onChange,
  onClick,
  style,
}: {
  icon: JSX.Element;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div className={styles.inputContainer} style={style}>
      <input
        onChange={(e) => onChange(e)}
        className={styles.input}
        placeholder={placeholder}
      />
      <div onClick={onClick} className={styles.iconContainer}>
        {icon}
      </div>
    </div>
  );
}
