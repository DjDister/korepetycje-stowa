import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import RoomsPage from "./RoomsPage";
import RoomPage from "./RoomPage";
import CheckInRoom from "./CheckInRoom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "register", element: <RegisterPage /> },
  { path: "/rooms", element: <RoomsPage /> },
  { path: "room/:userId/:roomId/checkin", element: <CheckInRoom /> },
  { path: "/room/:userId/:roomId", element: <RoomPage /> },
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
