import React from "react";
import "./App.css";
import NavBar from "./components/navBar/navBar";
import SubjectCard from "./components/SubjectCard/SubjectCard";
import BestTeachers from "./components/navBar/BestTeachers/BestTeachers";

const subjectList = ["Mathematics", "Physics", "English", "5D geometry by KK"];

function App() {
  return (
    <div className="page">
      <NavBar />
      <div className="content">
        <SubjectCard
          subjectName="Matematyka"
          subjectIcon={
            <img
              src={require("../src/assets/matematyka.png")}
              style={{ width: "100%", height: "100%" }}
            ></img>
          }
        />
        <SubjectCard
          subjectName="Fizyka"
          subjectIcon={
            <img
              src={require("../src/assets/fizyka.png")}
              style={{ width: "100%", height: "100%" }}
            ></img>
          }
        />
        <SubjectCard subjectName="Język polski" />
        <SubjectCard subjectName="Język angielski" />
        <SubjectCard
          subjectName="Biologia"
          subjectIcon={
            <img
              src={require("../src/assets/biologia.png")}
              style={{ width: "100%", height: "100%" }}
            ></img>
          }
        />
        <SubjectCard subjectName="Chemia" />
        <SubjectCard subjectName="Geografia" />
      </div>
      <div className="bestTeachers">
        <BestTeachers
          name="Neil Armstrong"
          subject="Astronomy"
          numOfStudents={50}
          rating={5}
          picture={
            <img
              src={require("../src/assets/John.png")}
              style={{ width: "100%", height: "100%" }}
            ></img>
          }
        />
        <BestTeachers
          name="Joanna Herman"
          subject="Matematyka"
          numOfStudents={31}
          rating={5}
        />
      </div>
    </div>
  );
}

export default App;
