import React from "react";
import { Routes, Route} from "react-router-dom";
import TrainerUpdate from "../admin/trainer/component/TrainerUpdate";
import TrainerDetails from "../admin/trainer/component/TrainerDetails";
import TrainerCreate from "../admin/trainer/component/TrainerCreate";
import TrainerList from "../admin/trainer/component/TrainerList";
const TrainerRoutes = ()=>{
    return(
       <Routes>
          <Route exact path="/" element={<TrainerList />} />
            <Route path="trainer" element={<TrainerList />} />
            <Route path="trainerdetails/:id" element={<TrainerDetails />} />
            <Route path="trainercreate" element={<TrainerCreate />} />
            <Route path="trainerupdate/:id" element={<TrainerUpdate />} />
       </Routes>
    );
};

export default TrainerRoutes;