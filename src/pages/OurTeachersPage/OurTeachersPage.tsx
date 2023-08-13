import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import { subjects } from "../../consts/subjects";
import { Teacher } from "../../types";
import getTeachers from "../../utils/getTeachers";
import styles from "./OurTeachersPage.module.css";

function OurTeachersPage() {
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
  }, [chosenSubjectFilter]);

  return (
    <Layout>
      <div className={styles.pageContainer}>
        {isOpenDropDownMenu ? (
          <div
            onClick={() => setIsOpenDropDownMenu(false)}
            className={styles.closingContainer}
          />
        ) : null}
        <div className={styles.ourTeachersLabel}>
          <div className={styles.teachersTitle}>
            Sprawdź naszych nauczycieli
            {chosenSubjectFilter && (
              <div style={{ color: "grey" }}>{`#${chosenSubjectFilter}`}</div>
            )}
          </div>
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
          {teachers
            .filter(
              (teacher) =>
                !(
                  chosenSubjectFilter &&
                  !teacher.subjects?.includes(chosenSubjectFilter)
                )
            )
            .map((teacher, index) => (
              <TeacherCard key={index} teacher={teacher} />
            ))}
        </div>
      </div>
    </Layout>
  );
}

export default OurTeachersPage;
