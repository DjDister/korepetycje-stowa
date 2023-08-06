import React, { useState } from "react"
import Layout from "../../components/Layout/Layout"
import styles from "./LandingPage.module.css"
import { Typography, Rating, Accordion, Button } from "@mui/material"
import VerticalLinearStepper from "./VeriticalStepper"
import SafetyCheckIcon from "@mui/icons-material/SafetyCheck"
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import PriceCheckIcon from "@mui/icons-material/PriceCheck"
import GroupIcon from "@mui/icons-material/Group"
import FlagCircleIcon from "@mui/icons-material/FlagCircle"
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled"

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
      <div className={styles.container} style={{ position: "relative" }}>
        <div className={styles.circle}></div>
        <div className={styles.firstPart}>
          <div className={styles.titlePart}>
            <div
              className={styles.title}
              style={{ color: "white", fontSize: "40px" }}
            >
              Unlock your full potencial with our tutors
              <br />
              <Button
                variant="contained"
                style={{ padding: "20px" }}
                color="primary"
              >
                Let's get started!
              </Button>
              <p style={{ fontSize: "30px", paddingTop: "10px" }}>
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
          Set yourself a goal
        </div>
        <div className={styles.goalContainer}>
          <div className={styles.goalElement}>
            <FlagCircleIcon className={styles.whyIcon} />
            <span>Set what would you like to acomplish</span>
          </div>
          <div className={styles.goalElement}>
            <AccessTimeFilledIcon className={styles.whyIcon} />
            <span>Set what would you like to acomplish</span>
          </div>
          <div className={styles.goalElement}>
            <FlagCircleIcon className={styles.whyIcon} />
            <span>Set what would you like to acomplish</span>
          </div>
          <div className={styles.goalElement}>
            <FlagCircleIcon className={styles.whyIcon} />
            <span>Set what would you like to acomplish</span>
          </div>
        </div>
        <div className={styles.title} style={{ marginTop: "40px" }}>
          Why should you work with us?
        </div>
        <div className={styles.whyContainer}>
          <div className={styles.whyElement}>
            <VerifiedUserIcon className={styles.whyIcon} />
            <span>Verified profiles</span>
          </div>
          <div className={styles.whyElement}>
            <WorkspacePremiumIcon className={styles.whyIcon} />
            <span>Expert tutors</span>
          </div>
          <div className={styles.whyElement}>
            <PriceCheckIcon className={styles.whyIcon} />
            <span>Affordable prices</span>
          </div>
          <div className={styles.whyElement}>
            <GroupIcon className={styles.whyIcon} />
            <span>Learn anytime</span>
          </div>
        </div>
        <div className={styles.title} style={{ marginTop: "40px" }}>
          How To get started
        </div>
        <VerticalLinearStepper />

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
            <Typography
              component="legend"
              style={{ fontSize: "25px", fontWeight: "bolder" }}
            >
              Understanding
            </Typography>
            <Rating
              name="read-only"
              value={value}
              readOnly
              style={{ fontSize: "25px", fontWeight: "bolder" }}
            />
          </div>
          <div className={styles.ratingElement}>
            <Typography
              component="legend"
              style={{ fontSize: "25px", fontWeight: "bolder" }}
            >
              Experience
            </Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
          <div className={styles.ratingElement}>
            <Typography
              component="legend"
              style={{ fontSize: "25px", fontWeight: "bolder" }}
            >
              Preparation
            </Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
          <div className={styles.ratingElement}>
            <Typography
              component="legend"
              style={{ fontSize: "25px", fontWeight: "bolder" }}
            >
              Flexibility
            </Typography>
            <Rating name="read-only" value={value} readOnly />
          </div>
        </div>
      </div>
    </Layout>
  )
}
