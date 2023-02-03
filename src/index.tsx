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
import OurTeachersPage from "./pages/OurTeachersPage/OurTeachersPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  { path: "/lessons", element: <LessonsPage /> },
  { path: "room/:userId/:roomId/checkin", element: <CheckInRoom /> },
  { path: "/room/:userId/:roomId", element: <RoomPage /> },
  {
    path: "/students",
    element: <StudentsPage />,
  },
  {
    path: "/teachers",
    element: <TeachersPage />,
  },
  {
    path: "/messages",
    element: <MessagesPage />,
  },
  {
    path: "/ourteachers",
    element: <OurTeachersPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
