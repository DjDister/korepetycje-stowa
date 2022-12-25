import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { logIn } from "./redux/loginSlice";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    error: "",
  });

  const auth = getAuth(firebaseApp);
  const loginStatus = useAppSelector((state) => state.loginStatus);
  console.log(loginStatus);
  const dispatch = useAppDispatch();

  const login = () => {
    console.log(`login`);
    signInWithEmailAndPassword(auth, formData.login, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        dispatch(logIn(user)); //some issue with type of user  - redux non serializable value error
        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        setFormData({ ...formData, error: errorMessage });
      });
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
        <div onClick={login}>LOGIN</div>
      </div>
    </div>
  );
}
