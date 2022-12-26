import React, { useState } from "react";
import styles from "./navbar.module.css";
import "../../App.css";

const Name = ["Kornik"];
const navElem = ["Our Teachers", "Our offer", "About us"];
const sub = ["Subjects"];
const signIn = ["SING IN"];
const subjectList = [
  "• Mathematics",
  "• Physics",
  "• English",
  "• 5D geometry by KK",
];

function NavBar() {
  const [status, setStatus] = useState<undefined | number>(undefined);
  const [open, setOpen] = useState(false);

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
                status === index ? styles.underlinded : null
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
        <div className={styles.flexBox}>
          {signIn.map((sign) => (
            <div className={styles.signing}>{sign}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
