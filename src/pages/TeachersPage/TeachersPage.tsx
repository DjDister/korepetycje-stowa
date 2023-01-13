import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import PlusIcon from "../../components/Icons/PlusIcon";
import Input from "../../components/Input/Input";
import NavBar from "../../components/navBar/navBar";
import StudentCard from "../../components/StudentCard/StudentCard";
import { db } from "../../firebaseConfig";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { updateStudents } from "../../redux/profileSlice";
import { Student } from "../../types";
import converter from "../../utils/converter";

export default function TeachersPage() {
  const profile = useAppSelector((state) => state.profile).profile;

  const [teachers, setTeachers] = useState(profile.students);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const q = query(
      collection(db, "users", profile.uid, "teachers").withConverter(
        converter<Student>()
      )
    );
    onSnapshot(q, (querySnapshot) => {
      const newTeachers: Student[] = [];
      querySnapshot.forEach((doc) => {
        const studentToAdd = doc.data();
        newTeachers.push(studentToAdd);
      });
      setTeachers(newTeachers);
      dispatch(updateStudents(newTeachers));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [filter, setFilter] = useState<string>("");

  return (
    <div className="pageContainer">
      <div className="navbarContainer">
        <NavBar />
      </div>
      <div className="flexCenter">
        {teachers.length > 0 ? (
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
                {teachers
                  .filter((teachers) => teachers.email.includes(filter))
                  .map((teacher, index) => (
                    <StudentCard
                      key={index}
                      student={{
                        uid: teacher.uid,
                        email: teacher.email,
                        photoURL: teacher.photoURL,
                      }}
                      belongsToUserId={teacher.uid}
                      studentId={profile.uid}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
