import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import "./loginPage.css";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { logIn } from "./redux/loginSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    passwordRepeated: "",
    error: "",
  });

  const auth = getAuth(firebaseApp);
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus.isLoggedIn) {
      navigate("/");
    }
  }, [loginStatus.isLoggedIn]);

  const register = () => {
    if (formData.password === formData.passwordRepeated) {
      createUserWithEmailAndPassword(auth, formData.login, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(logIn(user));
        })
        .catch((error) => {
          setFormData({ ...formData, error: error.message });
        });
    } else {
      setFormData({ ...formData, error: "Passwords are different" });
    }
  };

  const login = () => {
    signInWithEmailAndPassword(auth, formData.login, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(logIn(user)); //some issue with type of user  - redux non serializable value error
      })
      .catch((error) => {
        setFormData({ ...formData, error: error.message });
      });
  };

  const [registerMode, setRegisterMode] = useState(false);

  return (
    <div className="wholePage">
      <div className="leftSide">
        <div className="zaloguj">
          {registerMode ? "Zarejestruj sie" : "Zaloguj sie"}
        </div>
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
          {registerMode ? (
            <div className="partPassword">
              <input
                onChange={(e) =>
                  setFormData({ ...formData, passwordRepeated: e.target.value })
                }
                className="password"
                placeholder="Repeat password"
                type={"password"}
              ></input>
            </div>
          ) : null}
          <div className="logButton" onClick={registerMode ? register : login}>
            {registerMode ? "Zarejestruj sie" : "Zaloguj sie"}
            {!registerMode ? (
              <div className="tooLate" onClick={() => setRegisterMode(true)}>
                Nie masz konta? <div className="kolor">Zarejestruj się</div>
              </div>
            ) : (
              <div className="tooLate" onClick={() => setRegisterMode(false)}>
                Masz już konto? <div className="kolor">Zaloguj się</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rightSide">
        <img src={require("./Panda.png")} />
      </div>
    </div>
  );
}
