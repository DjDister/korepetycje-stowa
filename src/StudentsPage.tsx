import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import PlusIcon from "./components/Icons/PlusIcon";
import Input from "./components/Input/Input";
import Layout from "./components/Layout/Layout";
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
        if (studentToAdd.isOnlyForMessages) return;
        newStudents.push(studentToAdd);
      });
      setStudents(newStudents);
      dispatch(updateStudents(newStudents));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filter, setFilter] = useState<string>("");

  return (
    <Layout>
      <div className="flexCenter">
        <div className="inputContaine">
          <Input
            value={searchEmail}
            label={"Add student"}
            icon={<PlusIcon />}
            warning={warning}
            placeholder={"Add student"}
            onChange={(e) => setSearchEmail(e.target.value)}
            onClick={onAddStudent}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddStudent();
            }}
          />
        </div>
        {students.length > 0 ? (
          <div className="studentsListContainer">
            <div className="containerMargin">
              <div className="studentsSearchInputContainer">
                <Input
                  value={filter}
                  label={"Search"}
                  placeholder={"Search students"}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="studentsContainer">
                {students
                  .filter((student) => student.email.includes(filter))
                  .map((student, index) => (
                    <StudentCard
                      key={index}
                      student={student}
                      studentId={student.uid}
                      belongsToUserId={profile.uid}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="emptyStudentsContainer">
            No students added yet - add them above
          </div>
        )}
      </div>
    </Layout>
  );
}
