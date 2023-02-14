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
    <RouterProvider router={router} />
  </Provider>
);
