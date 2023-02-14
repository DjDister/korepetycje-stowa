import React from "react";
import styles from "./navbar.module.css";
import { useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../redux/loginSlice";
import { useAppDispatch } from "../../redux/hooks";
import Door from "../Icons/Door";

const navElemMiddle: { label: string; onClick: () => void; url?: string }[] = [
  {
    label: "Contact",
    onClick: () => {
      window.location.href = "mailto:porebskifilip@wp.pl";
    },
  },
];

const loggedList = [
  { label: "Students", url: "/students" },
  { label: "Teachers", url: "/teachers" },
  { label: "Messages", url: "/messages" },
];

function NavBar({ customStyles }: { customStyles?: React.CSSProperties }) {
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div className={styles.mainContainer} style={customStyles}>
      <div className={styles.marginContainer}>
        <div className={styles.logoContainer}>
          <div
            onClick={() => navigate("/")}
            className={styles.flexCenter}
            style={{ height: "90%", cursor: "pointer" }}
          >
            <img
              className={styles.logoImage}
              alt="logo"
              src={`https://media.discordapp.net/attachments/1046328170497982517/1064111326592507924/Krystian2__bark_beetle_as_a_superhero_logo_22903d65-7600-4d43-8cd8-5205adeabbe6.png?width=657&height=657`}
            />
            <div className={styles.logoName}>Kornik</div>
          </div>
        </div>
        <div className={styles.middleContainer}>
          {navElemMiddle.map((element, index) => (
            <div key={index} className={styles.middleLinkContainer}>
              {element.onClick ? (
                <div onClick={element.onClick} className={styles.flexCenter}>
                  {element.label}
                </div>
              ) : (
                <Link style={{ textDecoration: "none" }} to={element.url || ""}>
                  <div className={styles.flexCenter}>{element.label}</div>
                </Link>
              )}
            </div>
          ))}
          {loginStatus.isLoggedIn &&
            loggedList
              .filter(
                (elem) =>
                  elem.label.toLowerCase().slice(0, elem.label.length - 1) !==
                  profile.type
              )
              .map((element, index) => (
                <div key={index} className={styles.middleLinkContainer}>
                  <Link style={{ textDecoration: "none" }} to={element.url}>
                    <div className={styles.flexCenter}>{element.label}</div>
                  </Link>
                </div>
              ))}
        </div>

        {loginStatus.isLoggedIn ? (
          <div className={styles.userIconContainer}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
              onClick={() => navigate("/profile")}
            >
              <div style={{ fontWeight: 500 }}>
                {profile.displayName || profile.email}
              </div>
              <img
                className={styles.userIcon}
                alt={"UserIcon"}
                src={profile.providerData[0].photoURL ?? ""}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => dispatch(logOut())}
            >
              <Door />
            </div>
          </div>
        ) : (
          <div className={styles.buttonsContainer}>
            <div
              onClick={() => {
                window.location.href = "mailto:porebskifilip@wp.pl";
              }}
              className={styles.contactButton}
            >
              Contact
            </div>
            <div
              className={styles.signInButton}
              onClick={() => navigate("/login")}
            >
              Sign in
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
