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
import errorFeedback from "./utils/errorMessages";
import GoogleIcon from "./components/navBar/icons/GoogleIcon";
import MailIcon from "./components/navBar/icons/MailIcon";
import LockIcon from "./components/navBar/icons/LockIcon";

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
          setFormData({ ...formData, error: error.code });
          console.log(error);
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
        // ...
        navigate("/");
      })
      .catch((error) => {
        setFormData({ ...formData, error: error.code });
        console.log(error);
      });
  };

  const errorPrint = errorFeedback.find(
    (errorElem) => errorElem.code === formData.error
  );

  const [registerMode, setRegisterMode] = useState(false);

  return (
    <div className="wholePage">
      <div className="card"></div>
      <div className="leftSide">
        <div className="insideLeft">
          <div className="register">
            {registerMode ? "Zarejestruj sie" : "Zaloguj sie"}
          </div>
          <div className="errorPackage">
            {errorPrint ? (
              <div className="error">{errorPrint.message}</div>
            ) : null}
          </div>
          <div className="emailAndPassword">
            <div className="titleAndInputContainer">
              <div className="emailFont">E-mail</div>
              <div className="mailIcon">
                <div className="mailIconIcon">
                  <MailIcon />
                </div>
                <input
                  className="inputEmail"
                  type={"email"}
                  onChange={(e) =>
                    setFormData({ ...formData, login: e.target.value })
                  }
                  placeholder="Username/Email"
                ></input>
              </div>
            </div>
            <div className="titleAndInputContainer">
              <div className="emailFont">Password</div>
              <div className="mailIcon">
                <div className="mailIconIcon">
                  <LockIcon />
                </div>
                <input
                  className="inputEmail"
                  type={"password"}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                ></input>
              </div>
            </div>
          </div>
          {registerMode ? (
            <div className="repeatPasswordContainer">
              <div className="emailFont">Repeat Password</div>
              <div className="mailIcon">
                <div className="mailIconIcon">
                  <LockIcon />
                </div>
                <input
                  className="inputEmail"
                  type={"Password"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordRepeated: e.target.value,
                    })
                  }
                  placeholder="Repeat Password"
                ></input>
              </div>
            </div>
          ) : null}

          <div className="logInAndForgotPassword">
            <div className="logIn" onClick={registerMode ? register : login}>
              {registerMode ? "Register" : "Login"}
            </div>
            <div className="forgotPassword">
              {registerMode
                ? "Czy wiedziałeś że panda ma 6 palców w każdej z łap ?"
                : "Zapomniałeś hasła ?"}
            </div>
          </div>
          <div className="kreska">
            <div className="lub">lub</div>
          </div>
          <div className="companyLogin">
            <div className="icon">
              <GoogleIcon />
            </div>
            <div className="nextToIcon">
              {registerMode
                ? "Zarejestruj się z Google"
                : "Zaloguj się z Google"}
            </div>
          </div>
          <div className="noAccount">
            {registerMode ? "Masz już konto ?" : "Nie masz jeszcze konta ?"}
            <div
              className="join"
              onClick={() => {
                setRegisterMode(!registerMode);
                setFormData({ ...formData, error: "" });
              }}
            >
              {registerMode ? "Zaloguj się !" : "Dołącz teraz !"}
            </div>
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="insideRight">
          <img src={require("./Panda.png")} />
        </div>
      </div>
    </div>
  );
}
