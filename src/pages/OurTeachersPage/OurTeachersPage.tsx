import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import { Teacher } from "../../types";
import getTeachers from "../../utils/getTeachers";

export default function OurTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const teachers = await getTeachers();
      setTeachers(teachers);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      {teachers.map((teacher, index) => (
        <TeacherCard key={index} teacher={teacher} />
      ))}
    </Layout>
  );
}
