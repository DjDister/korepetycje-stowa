import React, { useState } from "react";
import PlusIcon from "./components/Icons/PlusIcon";
import SearchIcon from "./components/Icons/SearchIcon";
import Input from "./components/Input/Input";
import NavBar from "./components/navBar/navBar";
import { useAppSelector } from "./redux/hooks";
import "./StudentsPage.css";
import searchForUserWithEmail from "./utils/searchForUserWithEmail";
export default function StudentsPage() {
  const profile = useAppSelector((state) => state.profile).profile;
  const [searchEmail, setSearchEmail] = useState<string>("");
  const onAddStudent = async () => {
    console.log("add student");
    const user = await searchForUserWithEmail(searchEmail);
    if (user) {
      console.log(user);
      //add student to profile
    } else {
      console.log("user not found");
    }
  };
  console.log(searchEmail);
  return (
    <div className="pageContainer">
      <NavBar />
      <div className="flexCenter">
        <Input
          icon={<PlusIcon />}
          placeholder={"Add student"}
          onChange={(e) => setSearchEmail(e.target.value)}
          onClick={onAddStudent}
        />
        {profile.students.map((student, index) => (
          <div key={index}>{student.name}</div>
        ))}
      </div>
    </div>
  );
}
