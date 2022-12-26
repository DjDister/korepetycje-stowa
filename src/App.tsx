import { Link } from "react-router-dom";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { logOut } from "./redux/loginSlice";

function App() {
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const dispatch = useAppDispatch();

  return (
    <div>
      {loginStatus.isLoggedIn ? "true" : "false"}
      <Link to="login">LogIn</Link>
      <Link to="register">SignIn</Link>
      <div onClick={() => dispatch(logOut())}>LogOut</div>
    </div>
  );
}

export default App;
