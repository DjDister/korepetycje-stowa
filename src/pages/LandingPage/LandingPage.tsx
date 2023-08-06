import React, { useState } from "react"
import Layout from "../../components/Layout/Layout"
import styles from "./LandingPage.module.css"
import { Typography, Rating, Accordion, Button } from "@mui/material"

const subjectsArray = [
  { subject: "math", teacherNum: 5 },
  { subject: "math", teacherNum: 1 },
  { subject: "math", teacherNum: 2 },
  { subject: "math", teacherNum: 3 },
  { subject: "IT", teacherNum: 4 },
  { subject: "polish", teacherNum: 6 },
]

export default function LandingPage() {
  const [value, setValue] = useState<number | null>(4)

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.firstPart}>
          <div className={styles.titlePart}>
            <div className={styles.title} style={{ color: "white" }}>
              Unlock your full potencial with our tutors
              <br />
              <Button variant="contained" style={{ padding: "10px" }}>
                Let's start
              </Button>
            </div>
          </div>
          <div className={styles.imagePart}>
            <img src="../../images/frontImage.jpg" alt=""></img>
          </div>
        </div>
        <div className={styles.ratingContainer}>
          <div className={styles.ratingElement}>
            <Typography component="legend">Controlled</Typography>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
            />
          </div>
          <div className={styles.ratingElement}>
            <Typography component="legend">Read only</Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
          <div className={styles.ratingElement}>
            <Typography component="legend">Disabled</Typography>
            <Rating name="disabled" value={value} disabled />
          </div>
          <div className={styles.ratingElement}>
            <Typography component="legend">No rating given</Typography>
            <Rating name="no-value" value={null} />
          </div>
        </div>
        <div className={styles.title}>We teach:</div>
        <div className={styles.subjectContainer}>
          {subjectsArray.map((x, index) => (
            <div key={index} className={styles.subjectElem}>
              {x.subject}
              <span style={{ color: "gray" }}>
                {x.teacherNum} {x.teacherNum > 1 ? "teachers" : "teacher"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
