import React from "react";
import { Routes, Route} from "react-router-dom";

import TrainerAssignment from "../admin/classroom/components/TrainerAssignment";

const ClassroomTrainerRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<TrainerAssignment />}/>
           <Route path="trainerassignment/:id" element={<TrainerAssignment />} />
       </Routes>
    );
};

export default ClassroomTrainerRoutes;