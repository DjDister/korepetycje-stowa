import React from "react";
import NavBar from "./components/navBar/navBar";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import { useAppSelector } from "./redux/hooks";

export default function ProfilePage() {
  const loginStatus = useAppSelector((state) => state.loginStatus);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <NavBar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "80%",
        }}
      >
        <div style={{ height: "70%", width: "90%" }}>
          <ProfileCard profile={loginStatus.user} />
        </div>
      </div>
    </div>
  );
}
