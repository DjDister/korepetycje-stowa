import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import LoginPage from "./pages/LoginPage/LoginPage";
import RoomPage from "./pages/RoomPage/RoomPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import LessonsPage from "./pages/RoomsPage/RoomsPage";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LoginStatusChecker from "./utils/LoginStatusChecker";
import QuestionMarkIcon from "./components/Icons/QuestionMarkIcon";
import LandingPage from "./pages/LandingPage/LandingPage";

import { createTheme, ThemeProvider } from "@mui/material";
import OurTeachersPage from "./pages/OurTeachersPage/OurTeachersPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/lessons",
    element: (
      <LoginStatusChecker>
        <LessonsPage />
      </LoginStatusChecker>
    ),
  },
  {
    path: "/room/:userId/:roomId",
    element: (
      <LoginStatusChecker>
        <RoomPage />
      </LoginStatusChecker>
    ),
  },
  {
    path: "/my-students",
    element: (
      <LoginStatusChecker>
        <StudentsPage />
      </LoginStatusChecker>
    ),
  },
  {
    path: "/teachers",
    element: (
      <LoginStatusChecker>
        <TeachersPage />
      </LoginStatusChecker>
    ),
  },
  {
    path: "/messages",
    element: (
      <LoginStatusChecker>
        <MessagesPage />
      </LoginStatusChecker>
    ),
  },
  {
    path: "/settings",
    element: (
      <LoginStatusChecker>
        <ProfilePage />
      </LoginStatusChecker>
    ),
  },
  {
    path: "find-a-teacher",
    element: <OurTeachersPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    secondary: {
      main: "#192435",
    },
  },
});

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      {/* <div> */}
      <RouterProvider router={router} />
      {/* <div className="infoBox">
          <QuestionMarkIcon />
        </div>
        <div className="hiddenBox">
          Hi, if you want to test some things:
          <div className="lineFull">
            Whiteboard + video call: students/teacher page {`->`} icon of person{" "}
            {`->`} choose lesson / create as teacher{" "}
          </div>
          <div className="lineFull">
            Only teacher can add students and create new lessons
          </div>
          <div className="lineFull">
            Whiteboard is saved on leaving a lesson, so you can come back to it
          </div>
          <div className="lineFull">Student can rate teachers</div>
          <div style={{ marginTop: 20 }} className="lineFull">
            Teacher acc:{" "}
          </div>
          <div className="lineFull">email: teacher@gmail.com</div>
          <div className="lineFull">password: teacher</div>
          <div style={{ marginTop: 20 }} className="lineFull">
            Student acc:{" "}
          </div>
          <div className="lineFull">email: student@gmail.com</div>
          <div className="lineFull">password: student</div>
        </div>
      </div> */}
      {/* <div className="hiddenBox">
        Hi, if you want to test some things:
        <div className="lineFull">
          Whiteboard + video call: students/teacher page {`->`} icon of person{" "}
          {`->`} choose lesson / create as teacher{" "}
        </div>
        <div className="lineFull">
          Only teacher can add students and create new lessons
        </div>
        <div className="lineFull">
          Whiteboard is saved on leaving a lesson, so you can come back to it
        </div>
        <div className="lineFull">Student can rate teachers</div>
        <div style={{ marginTop: 20 }} className="lineFull">
          Teacher acc:{" "}
        </div>
        <div className="lineFull">email: teacher@gmail.com</div>
        <div className="lineFull">password: teacher</div>
        <div style={{ marginTop: 20 }} className="lineFull">
          Student acc:{" "}
        </div>
        <div className="lineFull">email: student@gmail.com</div>
        <div className="lineFull">password: student</div>
      </div> */}
    </Provider>
  </ThemeProvider>
);
