import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomBackgroundLayout from "../components/Layout/CustomBackgroundLayout";
import { useAppSelector } from "../redux/hooks";

export default function LoginStatusChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loginStatus.isLoggedIn) {
      navigate("/");
    }
  }, [loginStatus.isLoggedIn, navigate]);
  const [error, setError] = useState<string>("");

  return (
    <>
      {error !== "" ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          <CustomBackgroundLayout />
          {error}
        </div>
      ) : (
        children
      )}
    </>
  );
}
