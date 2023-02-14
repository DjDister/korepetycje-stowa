import React from "react";
import Error from "../Icons/Error";
import Warning from "../Icons/Warning";
import styles from "./Input.module.css";
export default function Input({
  icon,
  placeholder,
  onChange,
  onClick,
  style,
  error,
  label,
  warning,
  onKeyDown,
  value,
  customContainerStyle,
}: {
  icon?: JSX.Element;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  onClick?: () => void;
  error?: string;
  warning?: string;
  label?: string;
  value: string;
  customContainerStyle?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.container} style={customContainerStyle}>
      {label ? <div className={styles.labelContainer}>{label}</div> : null}
      <div className={styles.inputContainer} style={style}>
        <input
          onChange={(e) => onChange(e)}
          className={styles.input}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          value={value}
        />
        <div onClick={onClick} className={styles.iconContainer}>
          {icon}
        </div>
      </div>
      {error && (
        <div className={styles.errorContainer}>
          <Error height="80%" />
          <div className={styles.errorText}>{error}</div>
        </div>
      )}
      {warning && (
        <div className={styles.errorContainer}>
          <Warning height="80%" />
          <div className={styles.errorText}>{warning}</div>
        </div>
      )}
    </div>
  );
}
