import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { logIn } from "./redux/loginSlice";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    passwordRepeated: "",
    error: "",
  });
  const navigate = useNavigate();

  const auth = getAuth(firebaseApp);
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (loginStatus.isLoggedIn) {
      navigate("/");
    }
  }, [loginStatus.isLoggedIn]);
  const register = () => {
    console.log(`register`);
    if (formData.password === formData.passwordRepeated) {
      createUserWithEmailAndPassword(auth, formData.login, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          dispatch(logIn(user));

          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          setFormData({ ...formData, error: errorMessage });
        });
    } else {
      setFormData({ ...formData, error: "Passwords are different" });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "40%",
          height: "40%",
        }}
      >
        <div>is loggedIn {loginStatus.isLoggedIn ? "True" : "False"}</div>
        <div>{formData.error}</div>
        <input
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          placeholder="Username/Email"
        ></input>
        <input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          type={"password"}
        ></input>
        <input
          onChange={(e) =>
            setFormData({ ...formData, passwordRepeated: e.target.value })
          }
          placeholder="Repeat password"
          type={"password"}
        ></input>
        <div onClick={register}>Create acc</div>
      </div>
    </div>
  );
}
