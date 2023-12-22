import React from "react";
import { Routes, Route} from "react-router-dom";

import StudentAssignment from "../admin/classroom/components/StudentAssignment";
import MyClassroomList from "../student/myclassroom/components/MyClassroomList";
import MyClassroomDetails from "../student/myclassroom/components/MyClassroomDetails";
import StudentDetails from "../student/myclassroom/components/StudentDetails";
import PrivateRoute from "./PrivateRoute";

const ClassroomStudentRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<StudentAssignment />}/>
           <Route path="studentassignment/:id" element={<StudentAssignment />} />
           <Route path="myclassroomlist" element={<PrivateRoute element={<MyClassroomList />} allowedRoles={['Student']}/>}/>
           <Route path="myclassroomdetails/:id" element={<PrivateRoute element={<MyClassroomDetails />} allowedRoles={['Student']}/>} />
           <Route path="studentdetails/:id" element={<PrivateRoute element={<StudentDetails />} allowedRoles={['Student']}/>} />
       </Routes>
    );
};

export default ClassroomStudentRoutes;