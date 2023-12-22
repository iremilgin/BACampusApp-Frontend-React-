import React from "react";
import { Routes, Route} from "react-router-dom";

import ESManagement from "../admin/education-subject/components/ESManagement";
import ESList from "../admin/education-subject/components/ESList";


const EducationSubjectRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<ESList />}/>
           <Route
              path="educationsubjectmanagement/:id"
              element={<ESManagement />}
            />
               <Route path="educationsubjectlist/:id" element={<ESList />} />
       </Routes>
    );
};

export default EducationSubjectRoutes;