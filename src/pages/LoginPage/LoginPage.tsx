import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "../../components/Icons/GoogleIcon";
import LockIcon from "../../components/Icons/LockIcon";
import MailIcon from "../../components/Icons/MailIcon";
import { firebaseApp, db } from "../../firebaseConfig";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { loginSuccess, startLogin, loginFailure } from "../../redux/loginSlice";
import {
  setUserProfileFirstTime,
  setUserProfile,
} from "../../redux/profileSlice";
import errorFeedback from "../../utils/errorMessages";
import searchForUserWithEmail from "../../utils/searchForUserWithEmail";
import writeUserToDatabase from "../../utils/writeUserToDatabase";
import "./loginPage.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const photoDefault =
  "https://cdn.midjourney.com/2cd09984-a602-4b3d-bc3b-e565bfba82b1/grid_0.png";
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
  }, [loginStatus.isLoggedIn, navigate]);

  const register = () => {
    if (formData.password === formData.passwordRepeated) {
      createUserWithEmailAndPassword(auth, formData.login, formData.password)
        .then((userCredential) => {
          const user: User = {
            ...userCredential.user,
            providerData: [
              {
                ...userCredential.user.providerData[0],
                photoURL: photoDefault,
              },
            ],
          };
          const userInfo = {
            email: user.email ?? "",
            displayName: user.displayName ?? "",
            uid: user.uid,
          };

          dispatch(loginSuccess(userInfo));

          dispatch(setUserProfileFirstTime({ user: user, type: accType }));
          writeUserToDatabase(db, user, accType);
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
    dispatch(startLogin());

    signInWithEmailAndPassword(auth, formData.login, formData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        afterSuccessLogin(user);
      })
      .catch((error) => {
        setFormData({ ...formData, error: error.code });
        dispatch(loginFailure(error));
        console.log(error);
      });
  };

  const errorPrint = errorFeedback.find(
    (errorElem) => errorElem.code === formData.error
  );

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        afterSuccessLogin(user);
      })
      .catch((error) => {
        setFormData({ ...formData, error: error.code });
        dispatch(loginFailure(error));
      });
  };

  const afterSuccessLogin = async (user: User) => {
    dispatch(loginSuccess({ ...user }));

    const userData = await searchForUserWithEmail(user.email ?? "");
    if (userData) {
      dispatch(setUserProfile(userData));
    } else {
      dispatch(setUserProfileFirstTime({ user: user, type: accType }));
      writeUserToDatabase(db, user, accType);
    }
    navigate("/");
  };

  const [registerMode, setRegisterMode] = useState(false);
  const [accType, setAccType] = useState<"student" | "teacher">("student");
  return (
    <div className="wholePage">
      <div className="leftSide">
        <div className="insideLeft" style={{ backgroundColor: "inherit" }}>
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
          {/* {registerMode ? (
            <div>
              Choose account type:
              <div className="buttonsContainer">
                <div
                  style={
                    accType === "teacher"
                      ? { borderBottom: "green 2px solid" }
                      : {}
                  }
                  onClick={() => setAccType("teacher")}
                >
                  Teacher
                </div>
                <div
                  style={
                    accType === "student"
                      ? { borderBottom: "green 2px solid" }
                      : {}
                  }
                  onClick={() => setAccType("student")}
                >
                  Student
                </div>
              </div>
            </div>
          ) : null} */}
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
          <div className="companyLogin" onClick={loginWithGoogle}>
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
          <img alt="loginImage" src={require("../../Panda.png")} />
        </div>
      </div>
    </div>
  );
}
