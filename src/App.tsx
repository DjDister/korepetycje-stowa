import { useState, useEffect } from "react";
import Layout from "./components/Layout/Layout";
import TeacherCard from "./components/TeacherCard/TeacherCard";
import { Teacher } from "./types";
import getTeachers from "./utils/getTeachers";
import styles from "./App.module.css";
const subjects = ["Math", "English", "Science", "History"];
function App() {
  const [isOpenDropDownMenu, setIsOpenDropDownMenu] = useState(false);
  const [chosenSubjectFilter, setChosenSubjectFilter] = useState<string | null>(
    null
  );
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const teachers = chosenSubjectFilter
        ? await getTeachers(chosenSubjectFilter)
        : await getTeachers();
      setTeachers(teachers);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.ourTeachersLabel}>
          <div className={styles.teachersTitle}>Check out our Teachers</div>
          <div
            className={styles.dropDownButton}
            onClick={() => setIsOpenDropDownMenu(!isOpenDropDownMenu)}
          >
            Subject
            {isOpenDropDownMenu ? (
              <div className={styles.dropDownMenu}>
                <div
                  onClick={() => setChosenSubjectFilter(null)}
                  className={styles.dropDownMenuItem}
                >
                  All
                </div>
                {subjects.map((subject, index) => (
                  <div
                    onClick={() => setChosenSubjectFilter(subject)}
                    key={index}
                    className={styles.dropDownMenuItem}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.ourTeachersContainer}>
          {teachers.map((teacher, index) => (
            <TeacherCard key={index} teacher={teacher} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default App;
