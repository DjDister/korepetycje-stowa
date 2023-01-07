import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import PlusIcon from "./components/Icons/PlusIcon";
import Input from "./components/Input/Input";
import NavBar from "./components/navBar/navBar";
import StudentCard from "./components/StudentCard/StudentCard";
import { db } from "./firebaseConfig";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { updateStudents } from "./redux/profileSlice";
import "./StudentsPage.css";
import { Student } from "./types";
import addUserToUsersStudents from "./utils/addUserToUsersStudents";
import converter from "./utils/converter";
import searchForUserWithEmail from "./utils/searchForUserWithEmail";
export default function StudentsPage() {
  const profile = useAppSelector((state) => state.profile).profile;

  const [students, setStudents] = useState(profile.students);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const dispatch = useAppDispatch();
  const [warning, setWarning] = useState<string>("");
  const onAddStudent = async () => {
    const user = await searchForUserWithEmail(searchEmail);
    if (user) {
      if (students.find((student) => student.uid === user.uid))
        return setWarning("Student already added");
      if (user.uid === profile.uid) return setWarning("You can't add yourself");
      setWarning("");
      await addUserToUsersStudents(
        profile,
        user.email,
        user.uid,
        user.providerData[0].photoURL
      );
    } else {
      setWarning("Student not found");
    }
  };
  useEffect(() => {
    const q = query(
      collection(db, "users", profile.uid, "students").withConverter(
        converter<Student>()
      )
    );
    onSnapshot(q, (querySnapshot) => {
      const newStudents: Student[] = [];
      querySnapshot.forEach((doc) => {
        const studentToAdd = doc.data();
        newStudents.push(studentToAdd);
      });
      setStudents(newStudents);
      dispatch(updateStudents(newStudents));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filter, setFilter] = useState<string>("");

  return (
    <div className="pageContainer">
      <div className="navbarContainer">
        <NavBar />
      </div>
      <div className="flexCenter">
        <div className="inputContainer">
          <Input
            label={"Add student"}
            icon={<PlusIcon />}
            warning={warning}
            placeholder={"Add student"}
            onChange={(e) => setSearchEmail(e.target.value)}
            onClick={onAddStudent}
          />
        </div>
        {students.length > 0 ? (
          <div className="studentsListContainer">
            <div className="containerMargin">
              <div className="studentsSearchInputContainer">
                <Input
                  label={"Search"}
                  placeholder={"Search students"}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="studentsContainer">
                {students
                  .filter((student) => student.email.includes(filter))
                  .map((student, index) => (
                    <StudentCard key={index} student={student} />
                  ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
