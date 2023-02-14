import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  return <>{children}</>;
}
