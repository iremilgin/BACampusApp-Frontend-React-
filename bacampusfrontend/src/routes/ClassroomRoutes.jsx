import React from "react";
import { Routes, Route} from "react-router-dom";

import ClassroomList from "../admin/classroom/components/ClassroomList";
import { ClassroomCreate } from "../admin/classroom/components/ClassroomCreate";
import { ClassroomDelete } from "../admin/classroom/components/ClassroomDelete";
import ClassroomUpdate from "../admin/classroom/components/ClassroomUpdate";
import StudentAssignment from "../admin/classroom/components/StudentAssignment";
import ClassroomDetail from "../admin/classroom/components/ClassroomDetail";
import TrainerAssignment from "../admin/classroom/components/TrainerAssignment"


const ClassroomRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<ClassroomList />}/>
           <Route path="/classroom" element={<ClassroomList />} />
            <Route path="classroomCreate" element={<ClassroomCreate />} />
            <Route path="classroomDelete/:id" element={<ClassroomDelete />} />
            <Route path="classroomUpdate/:id" element={<ClassroomUpdate />} />
           <Route path="studentassignment/:id" element={<StudentAssignment />} />
           <Route path="trainerassignment/:id" element={<TrainerAssignment />} />
           <Route path="classroomDetail/:id" element={<ClassroomDetail />} />
       </Routes>
    );
};

export default ClassroomRoutes;
