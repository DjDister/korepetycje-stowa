import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import LoginPage from "./LoginPage";
import RoomPage from "./RoomPage/RoomPage";
import CheckInRoom from "./CheckInRoom";
import StudentsPage from "./StudentsPage";
import LessonsPage from "./RoomsPage";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import MessagesPage from "./pages/MessagesPage/MessagesPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LoginStatusChecker from "./utils/LoginStatusChecker";
import QuestionMarkIcon from "./components/Icons/QuestionMarkIcon";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    path: "room/:userId/:roomId/checkin",
    element: (
      <LoginStatusChecker>
        <CheckInRoom />
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
    path: "/students",
    element: (
      <LoginStatusChecker>
        <StudentsPage />,
      </LoginStatusChecker>
    ),
  },
  {
    path: "/teachers",
    element: (
      <LoginStatusChecker>
        <TeachersPage />,
      </LoginStatusChecker>
    ),
  },
  {
    path: "/messages",
    element: (
      <LoginStatusChecker>
        <MessagesPage />,
      </LoginStatusChecker>
    ),
  },
  {
    path: "/profile",
    element: (
      <LoginStatusChecker>
        <ProfilePage />,
      </LoginStatusChecker>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <div>
      <RouterProvider router={router} />
      <div className="infoBox">
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
    </div>
  </Provider>
);
