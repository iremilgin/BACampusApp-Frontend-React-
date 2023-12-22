import React from "react";
import { Routes, Route } from "react-router-dom";

import StudentList from "../admin/student/components/StudentList";
import StudentCreate from "../admin/student/components/StudentCreate";
import StudentDetails from "../admin/student/components/StudentDetails";
import StudentUpdate from "../admin/student/components/StudentUpdate";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<StudentList />} />
      <Route path="student" element={<StudentList />} />
      <Route path="studentcreate" element={<StudentCreate />} />
      <Route path="studentdetails/:id" element={<StudentDetails />} />
      <Route path="studentupdate/:id" element={<StudentUpdate />} />
    </Routes>
  );
};

export default StudentRoutes;