import React, { useState } from "react"
import Layout from "../../components/Layout/Layout"
import styles from "./LandingPage.module.css"
import { Typography, Rating, Accordion, Button } from "@mui/material"
import VerticalLinearStepper from "./VeriticalStepper"

const subjectsArray = [
  { subject: "math", teacherNum: 5 },
  { subject: "math", teacherNum: 1 },
  { subject: "math", teacherNum: 2 },
  { subject: "math", teacherNum: 3 },
  { subject: "IT", teacherNum: 4 },
  { subject: "polish", teacherNum: 6 },
]

export default function LandingPage() {
  const [value, setValue] = useState<number | null>(4.5)

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.firstPart}>
          <div className={styles.titlePart}>
            <div className={styles.title} style={{ color: "white" }}>
              Unlock your full potencial with our tutors
              <br />
              <Button
                variant="contained"
                style={{ padding: "20px" }}
                color="primary"
              >
                Let's get started!
              </Button>
              <p style={{ fontSize: "20px", paddingTop: "10px" }}>
                We will teach you for your matura, exams and more...
              </p>
            </div>
          </div>
          <div className={styles.imagePart}>
            <img
              alt=""
              src={`https://media.discordapp.net/attachments/1046328170497982517/1064111326592507924/Krystian2__bark_beetle_as_a_superhero_logo_22903d65-7600-4d43-8cd8-5205adeabbe6.png?width=657&height=657`}
              className={styles.imageImg}
            ></img>
          </div>
        </div>
        <div className={styles.ratingContainer}>
          {/* <div className={styles.ratingElement}>
            <Typography component="legend">Controlled</Typography>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
            />
          </div> */}
          <div className={styles.ratingElement}>
            <Typography component="legend">Understanding</Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
          <div className={styles.ratingElement}>
            <Typography component="legend">Experience</Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
          <div className={styles.ratingElement}>
            <Typography component="legend">Preparation</Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
          <div className={styles.ratingElement}>
            <Typography component="legend">Flexibility</Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
        </div>
        <div className={styles.title} style={{ marginTop: "40px" }}>
          We teach:
        </div>
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
        <div className={styles.title} style={{ marginTop: "40px" }}>
          How To get started
        </div>
        <VerticalLinearStepper />
      </div>
    </Layout>
  )
}
