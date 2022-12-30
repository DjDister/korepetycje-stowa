import React, { useState } from "react";
import styles from "./navbar.module.css";
import "../../App.css";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { logOut } from "../../redux/loginSlice";
import { useAppDispatch } from "../../redux/hooks";

const Name = ["Kornik"];
const navElem = ["Our Teachers", "Our offer", "About us"];

const loggedElem = [
  { label: "Znajomi" },
  { label: "Wiadomości" },
  { label: "Ustawienia" },
  { label: "Pomoc" },
  { label: "Wyloguj się" },
];

const sub = ["Subjects"];
const signIn = ["sing in"];
const subjectList = ["Mathematics", "Physics", "English", "5D geometry by KK"];

function NavBar() {
  const [status, setStatus] = useState<undefined | number>(undefined);
  const [open, setOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const loginStatus = useAppSelector((state) => state.loginStatus);
  const dispatch = useAppDispatch();

  //loginStatus.isLoggedIn ? tak:nie
  return (
    <div className={styles.mainNav}>
      <div className={styles.SVG}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#5465FF"
            fill-opacity="1"
            d="M0,64L34.3,69.3C68.6,75,137,85,206,106.7C274.3,128,343,160,411,165.3C480,171,549,149,617,128C685.7,107,754,85,823,80C891.4,75,960,85,1029,117.3C1097.1,149,1166,203,1234,208C1302.9,213,1371,171,1406,149.3L1440,128L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
          ></path>
        </svg>
        <div className={styles.SVG2}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#788bff"
              fill-opacity="1"
              d="M0,288L24,245.3C48,203,96,117,144,112C192,107,240,181,288,218.7C336,256,384,256,432,245.3C480,235,528,213,576,170.7C624,128,672,64,720,64C768,64,816,128,864,160C912,192,960,192,1008,170.7C1056,149,1104,107,1152,80C1200,53,1248,43,1296,69.3C1344,96,1392,160,1416,192L1440,224L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className={styles.SVG3}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#9bb1ff"
              fill-opacity="1"
              d="M0,160L48,165.3C96,171,192,181,288,202.7C384,224,480,256,576,261.3C672,267,768,245,864,218.7C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className={styles.insideMain}>
        <div className={styles.flexBox}>
          {Name.map((name) => (
            <div className={styles.logoName}>{name}</div>
          ))}
        </div>
        <div className={styles.navBlocksCont}>
          {navElem.map((elem, index) => (
            <div
              key={index}
              className={`${styles.navBlocks} ${
                status === index ? styles.underlined : null
              }`}
              onMouseEnter={() => setStatus(index)}
              onMouseLeave={() => setStatus(undefined)}
            >
              {elem}
            </div>
          ))}
        </div>
        <div
          className={styles.subjectContainer}
          onMouseEnter={() => {
            setOpen(true);
          }}
          onMouseLeave={() => {
            setOpen(false);
          }}
        >
          {sub.map((subj) => (
            <div className={styles.subjects}>{subj}</div>
          ))}
          {open ? (
            <div className={styles.blobPackage}>
              <div
                className={`${styles.dropdownSubjects} 
                ${open ? styles.active : styles.inactive})
              `}
              >
                <ul className={styles.dropdownItem}>
                  {subjectList.map((subList) => (
                    <div className={styles.subItem}>{subList}</div>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        {loginStatus.isLoggedIn ? (
          <div className={styles.DropDownMenuAbsolute}>
            <div
              className={styles.loggedIn}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              User
            </div>
            {isUserMenuOpen ? (
              <div className={`${styles.dropdownMenuPage}`}>
                {loggedElem.map((loggedList) => (
                  <div
                    className={`${styles.DropdownMenuPageItem}
                    
                  ${
                    loggedList.label === "Wyloguj się"
                      ? styles.redMenuItem
                      : null
                  }
                `}
                    onClick={
                      loggedList.label === "Wyloguj się"
                        ? () => dispatch(logOut())
                        : () => null
                    }
                  >
                    {loggedList.label}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className={styles.flexBox}>
            <Link
              style={{ color: "inherit", textDecoration: "inherit" }}
              className={styles.signButton}
              to="login"
            >
              sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
