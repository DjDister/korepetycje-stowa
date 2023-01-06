import React, { useState } from "react";
import styles from "./navbar.module.css";
import "../../App.css";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { logOut } from "../../redux/loginSlice";
import { useAppDispatch } from "../../redux/hooks";

const Name = ["Kornik"];

const loggedElem = [
  { label: "Znajomi" },
  { label: "Wiadomości" },
  { label: "Ustawienia" },
  { label: "Pomoc" },
  { label: "Wyloguj się" },
];

const sub = ["Subjects"];
const signIn = ["sing in"];

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
              <div className={styles.signIn}>sign in</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
