import React from "react";
import { Routes, Route} from "react-router-dom";
import StudentAssigmentList from "../admin/homework/components/StudentAssigmentList";
import StudentHomeworkDetails from "../admin/homework/components/StudentHomeworkDetails";
import HomeworkList from "../admin/homework/components/HomeworkList";
import HomeWorkListByStudent from "../student/homework/components/HomeworkListByStudent";
import PrivateRoute from "./PrivateRoute";
import HomeworkDetail from "../student/homework/components/HomeworkDetail";

import StudentAssigmentListTrainer from "../trainer/homework/components/StudentAssigmentList";
import StudentHomeworkDetailsTrainer from "../trainer/homework/components/StudentHomeworkDetails";
const StudentHomeworkRoutes = ()=>{
    return(
       <Routes>
         <Route exact path="/" element={<HomeworkList/>}/>
           <Route path="studentassigmentlist/:id" element={<StudentAssigmentList/>} />
           <Route path="studenthomeworkdetail/:homeworkId/:studentHomeworkId" element={<StudentHomeworkDetails/>} />
           <Route path="trainerstudentassigmentlist/:id" element={<PrivateRoute element={<StudentAssigmentListTrainer />} allowedRoles={['Trainer']}/>} />
           <Route path="trainerstudenthomeworkdetails/:homeworkId/:studentHomeworkId" element={<PrivateRoute element={<StudentHomeworkDetailsTrainer />} allowedRoles={['Trainer']}/>} />
           {/* <Route path="givepoint/:id" element={<HomeworkAdd/>} /> */}
           <Route path="studenthomeworklist" element={ <PrivateRoute  element={<HomeWorkListByStudent />} allowedRoles={['Student']}/>
  }/>
  <Route path="studenthomeworkdetail/:id" element={ <PrivateRoute  element={<HomeworkDetail />} allowedRoles={['Student']}/>
  }/>
       </Routes>
    );
};

export default StudentHomeworkRoutes;