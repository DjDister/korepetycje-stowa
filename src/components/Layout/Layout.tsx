import React from "react";
import NavBar from "../navBar/navBar";
import CustomBackgroundLayout from "./CustomBackgroundLayout";
import styles from "./Layout.module.css";

export default function Layout({
  children,
  isNavbarVisible = true,
  isBackgroundDecorationVisible = true,
  navbarCustomStyles,
}: {
  children: React.ReactNode;
  isNavbarVisible?: boolean;
  isBackgroundDecorationVisible?: boolean;
  navbarCustomStyles?: React.CSSProperties;
}) {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {isBackgroundDecorationVisible && <CustomBackgroundLayout />}
      {isNavbarVisible && <NavBar />}
      <div className={isNavbarVisible ? styles.container : ""}>{children}</div>
    </div>
  );
}
