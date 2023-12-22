import React from "react";
import { Routes, Route } from "react-router-dom";

import "../scss/main.scss";
import "./Right";
import Right from "./Right";

import AdminRoutes from "../../../routes/AdminRoutes"
import CategoryRoutes from "../../../routes/CategoryRoutes"
import ClassroomRoutes from "../../../routes/ClassroomRoutes"
import ClassroomStudentRoutes from "../../../routes/ClassroomStudentRoutes"
import ClassroomTrainerRoutes from "../../../routes/ClassroomTrainerRoutes"
import CommentRoutes from "../../../routes/CommentRoutes"
import EducationRoutes  from "../../../routes/EducationRoutes";
import EducationSubjectRoutes from "../../../routes/EducationSubjectRoutes"
import HomeworkRoutes from "../../../routes/HomeworkRoutes"
import StudentHomeworkRoutes from "../../../routes/StudentHomeworkRoutes"
import StudentRoutes from "../../../routes/StudentRoutes"
import SubjectRoutes from "../../../routes/SubjectRoutes"
import SupplementaryResourceRoutes from "../../../routes/SupplementaryResourceRoutes"
import TagRoutes from "../../../routes/TagRoutes"
import TechnicalUnitsRoutes from "../../../routes/TechnicalUnitsRoutes"
import TrainerRoutes from "../../../routes/TrainerRoutes"



const Main = () => {
  return (
    <>
      <Right />
      <main>
        <section>
          {/* <Routes>
            <Route path="layout" />
            <Route path="education/*" element={<EducationRoutes />} />
            <Route path="admins/*" element={<AdminRoutes />} />
            <Route path="category/*" element={<CategoryRoutes />} />
            <Route path="classroom/*" element={<ClassroomRoutes />} />
            <Route path="classroomstudent/*" element={<ClassroomStudentRoutes />} />
            <Route path="trainerassignment/*" element={<ClassroomTrainerRoutes />} />
            <Route path="studentassignment/*" element={<ClassroomStudentRoutes />} />
            <Route path="classroomtrainer/*" element={<ClassroomTrainerRoutes />} />
            <Route path="comment/*" element={<CommentRoutes />} />
            <Route path="educationsubject/*" element={<EducationSubjectRoutes />} />
            <Route path="homework/*" element={<HomeworkRoutes />} />
            <Route path="studenthomework/*" element={<StudentHomeworkRoutes />} />
            <Route path="student/*" element={<StudentRoutes />} />
            <Route path="subjects/*" element={<SubjectRoutes />} />
            <Route path="supplementaryresources/*" element={<SupplementaryResourceRoutes />} />
            <Route path="tags/*" element={<TagRoutes />} />
            <Route path="technicalunits/*" element={<TechnicalUnitsRoutes />} />
            <Route path="trainer/*" element={<TrainerRoutes />} />
          </Routes> */}
        </section>
      </main>
    </>
  );
};

export default Main;
