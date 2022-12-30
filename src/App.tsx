import { Link } from "react-router-dom";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { logOut } from "./redux/loginSlice";

import NavBar from "./components/navBar/navBar";
function App() {
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const dispatch = useAppDispatch();

  return (
    <div>
      <NavBar />
      {loginStatus.isLoggedIn ? "true" : "false"}
      <Link to="login">LogIn</Link>
      <Link to="register">SignIn</Link>
      {loginStatus.isLoggedIn ? (
        <>
          <div onClick={() => dispatch(logOut())}>LogOut</div>
          <Link to="rooms">Rooms</Link>
        </>
      ) : null}
    </div>
  );
}

export default App;
