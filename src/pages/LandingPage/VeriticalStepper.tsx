import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import StepContent from "@mui/material/StepContent"
import Button from "@mui/material/Button"

import Typography from "@mui/material/Typography"
import styles from "./LandingPage.module.css"

const steps = [
  {
    label: "Set a Goal",
    description: `Start by defining your objective for taking the math extra classes. Are you looking to improve your grades, deepen your understanding of certain topics, or prepare for a specific exam? Setting a clear goal will help you stay motivated and focused throughout the learning process.`,
  },
  {
    label: "Choose a Teacher",
    description:
      "Research and select a qualified math teacher or tutoring program that aligns with your goals. Look for teachers with strong expertise in the subjects you need help with. Check their qualifications, teaching methods, reviews, and teaching materials. You might also want to consider whether you prefer in-person classes, online lessons, or a combination of both.",
  },
  {
    label: "Start Learning",
    description: `Once you've chosen a teacher or program, enroll in the extra math classes and begin your learning journey. Attend classes regularly and actively participate by asking questions and practicing problems. Make sure to take notes and review them after each session. Practice consistently, complete assignments, and work through practice problems to reinforce your understanding. Remember that consistent effort is key to making progress in math.`,
  },
]

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Box className={styles.box}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} style={{ width: "90%" }}>
            <StepLabel
              style={{ fontSize: "20px", fontWeight: "bolder" }}
              className={styles.fontChange}
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              <span style={{ fontSize: "25px", fontWeight: "bolder" }}>
                {step.label}
              </span>
            </StepLabel>
            <StepContent>
              <Typography variant="h6">{step.description}</Typography>
              <Box sx={{ mb: 2 }} style={{ fontSize: "40px" }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
