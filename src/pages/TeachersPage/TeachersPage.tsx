import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";
import StudentCard from "../../components/StudentCard/StudentCard";
import { db } from "../../firebaseConfig";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { updateStudents } from "../../redux/profileSlice";
import { Teacher } from "../../types";
import converter from "../../utils/converter";

export default function TeachersPage() {
  const profile = useAppSelector((state) => state.profile).profile;
  const [teachers, setTeachers] = useState<Teacher[]>(profile.students);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const q = query(
      collection(db, "users", profile.uid, "teachers").withConverter(
        converter<Teacher>()
      )
    );
    onSnapshot(q, (querySnapshot) => {
      const newTeachers: Teacher[] = [];
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
    <Layout>
      <div className="flexCenter">
        {teachers.length > 0 ? (
          <div className="studentsListContainer">
            <div className="containerMargin">
              <div className="studentsSearchInputContainer">
                <Input
                  label={"Search"}
                  placeholder={"Search teachers"}
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
                        type: "teacher",
                      }}
                      rating={teacher.rating}
                      belongsToUserId={teacher.uid}
                      studentId={profile.uid}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
