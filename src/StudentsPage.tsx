import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import PlusIcon from "./components/Icons/PlusIcon";
import Input from "./components/Input/Input";
import NavBar from "./components/navBar/navBar";
import StudentCard from "./components/StudentCard/StudentCard";
import { db } from "./firebaseConfig";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { updateStudents } from "./redux/profileSlice";
import "./StudentsPage.css";
import addUserToUsersStudents from "./utils/addUserToUsersStudents";
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
    onSnapshot(doc(db, "users", profile.uid), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log(source, " data: ", doc.data());
      setStudents(doc.data()?.students);
      dispatch(updateStudents(doc.data()?.students));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div className="studentsListContainer">
          <div className="containerMargin">
            <div className="studentsSearchInputContainer">
              <Input
                label={"Search"}
                placeholder={"Search students"}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            <div className="studentsContainer">
              {students.map((student, index) => (
                <StudentCard key={index} student={student} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
