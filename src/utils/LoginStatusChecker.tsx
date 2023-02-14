import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomBackgroundLayout from "../components/Layout/CustomBackgroundLayout";
import { useAppSelector } from "../redux/hooks";
import useWindowSize from "./useWindowSize";

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
  const size = useWindowSize();
  const [error, setError] = useState<string>("");
  useEffect(() => {
    if (window.innerWidth < 992) {
      setError("Please use a larger screen");
    } else if (
      size.width &&
      size.height &&
      (size.width < 992 || size.height < 600)
    ) {
      setError("Please use a larger screen");
    } else {
      setError("");
    }
  }, [size.width, size.height]);

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
