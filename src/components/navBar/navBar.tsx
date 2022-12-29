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
