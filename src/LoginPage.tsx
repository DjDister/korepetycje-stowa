import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import "./loginPage.css";

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
    <div className="wholePage">
      <div className="leftSide">
        <div className="zaloguj">Zaloguj sie</div>
        <div className="twoInputs">
          <div className="partPassword">
            <input
              className="password"
              onChange={(e) =>
                setFormData({ ...formData, login: e.target.value })
              }
              placeholder="Username/Email"
            ></input>
          </div>

          <div className="partPassword">
            <input
              className="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="password"
              type={"password"}
            ></input>
          </div>

          <div className="logButton" onClick={login}>
            Zaloguj sie
          </div>
        </div>
      </div>

      <div className="rightSide">
        <img src={require("./Panda.png")} />
      </div>
    </div>
  );
}