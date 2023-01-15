import React from "react";
import NavBar from "../navBar/navBar";

export default function Layout({
  children,
  isNavbarVisible = true,
  isBackgroundDecorationVisible,
  navbarCustomStyles,
}: {
  children: React.ReactNode;
  isNavbarVisible?: boolean;
  isBackgroundDecorationVisible?: boolean;
  navbarCustomStyles?: React.CSSProperties;
}) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isNavbarVisible && (
        <div style={{ height: "10%" }}>
          <NavBar customStyles={navbarCustomStyles} />
        </div>
      )}
      <div style={{ height: isNavbarVisible ? "90%" : "100%" }}>{children}</div>
    </div>
  );
}
