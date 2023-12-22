import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/adminlayout/Layout";
import StudentLayout from "./layouts/studentlayout/StudentLayout";
import Account from "./features/account/Account";
import ForgotPassword from "./features/account/components/ForgotPassword";
import ResetPassword from "./features/account/components/ResetPassword";
import Trainer from "./admin/trainer/Trainer";
import React from "react";
import { Login } from "./features/account/components/Login";
import AdminRoutes from "./routes/AdminRoutes"
import CategoryRoutes from "./routes/CategoryRoutes"
import SubCategoryRoutes from "./routes/SubCategoryRoutes"
import ClassroomRoutes from "./routes/ClassroomRoutes"
import ClassroomStudentRoutes from "./routes/ClassroomStudentRoutes"
import ClassroomTrainerRoutes from "./routes/ClassroomTrainerRoutes"
import CommentRoutes from "./routes/CommentRoutes"
import EducationRoutes from "./routes/EducationRoutes";
import EducationSubjectRoutes from "./routes/EducationSubjectRoutes"
import HomeworkRoutes from "./routes/HomeworkRoutes"
import StudentHomeworkRoutes from "./routes/StudentHomeworkRoutes"
import StudentRoutes from "./routes/StudentRoutes"
import SubjectRoutes from "./routes/SubjectRoutes"
import SupplementaryResourceRoutes from "./routes/SupplementaryResourceRoutes"
import TagRoutes from "./routes/TagRoutes"
import TechnicalUnitsRoutes from "./routes/TechnicalUnitsRoutes"
import TrainerRoutes from "./routes/TrainerRoutes"
import TrainerLayout from "./layouts/trainerlayout/TrainerLayout";
import { SessionProvider } from "./helper/SessionContext";
import TrainingTypeRoutes from "./routes/TrainingTypeRoutes"
import BranchRoutes from "./routes/BranchRoutes";
import GroupTypeRoutes from "./routes/GroupTypeRoutes"
import ErrorRoutes from "./routes/ErrorRoutes";
import ErrorPage from "./shared/error-boundary/ErrorPage";


function App() {
  return (
    <>
     <SessionProvider>
      <Routes>
        <Route path="/" element={<Account />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword/*" element={<ResetPassword />} />  
        <Route path="error/*" element={<ErrorRoutes />} />
        <Route path="*" element={<ErrorPage />} />    

        <Route path="/student/*" element={<StudentLayout />} >
          <Route path="education/*" element={<EducationRoutes />} />
          <Route path="supplementaryresource/*" element={<SupplementaryResourceRoutes />} />
          <Route path="homework/*" element={<StudentHomeworkRoutes />} />
          <Route path="classroomstudent/*" element={<ClassroomStudentRoutes />} />
        </Route>
        <Route path="/trainer/*" element={<TrainerLayout />} >
        <Route path="homework/*" element={<HomeworkRoutes />} />
        <Route path="studenthomework/*" element={<StudentHomeworkRoutes />} />
        <Route path="supplementaryresource/*" element={<SupplementaryResourceRoutes />} />
        </Route>
        <Route path="/admin/*" element={<Layout />} >
          <Route path="education/*" element={<EducationRoutes />} />
          <Route path="admin/*" element={<AdminRoutes />} />
          <Route path="category/*" element={<CategoryRoutes />} />
          <Route path="subcategory/*" element={<SubCategoryRoutes />} />
          <Route path="classroom/*" element={<ClassroomRoutes />} />
          <Route path="classroomstudent/*" element={<ClassroomStudentRoutes />} />
          <Route path="studentassignment/*" element={<ClassroomStudentRoutes />} />
          <Route path="classroomtrainer/*" element={<ClassroomTrainerRoutes />} />
          <Route path="trainerassignment/*" element={<ClassroomTrainerRoutes />} />
          <Route path="comment/*" element={<CommentRoutes />} />
          <Route path="educationsubject/*" element={<EducationSubjectRoutes />} />
          <Route path="homework/*" element={<HomeworkRoutes />} />
          <Route path="studenthomework/*" element={<StudentHomeworkRoutes />} />
          <Route path="student/*" element={<StudentRoutes />} />
          <Route path="subjects/*" element={<SubjectRoutes />} />
          <Route path="supplementaryresource/*" element={<SupplementaryResourceRoutes />} />
          <Route path="tags/*" element={<TagRoutes />} />
          <Route path="technicalunits/*" element={<TechnicalUnitsRoutes />} />
          <Route path="trainer/*" element={<TrainerRoutes />} />
          <Route path="trainingtype/*" element={<TrainingTypeRoutes />} />
          <Route path="branch/*" element={<BranchRoutes />} />
          <Route path="grouptype/*" element={<GroupTypeRoutes />} />

        </Route>      
      </Routes>  
      </SessionProvider>    
    </>
  );
}


export default App;
