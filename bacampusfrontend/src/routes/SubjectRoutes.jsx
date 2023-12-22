import React from "react";
import { Routes, Route} from "react-router-dom";
import SubjectList from "../admin/subject/components/SubjectList";
import SubjectCreate from "../admin/subject/components/SubjectCreate";
import SubjectUpdate from "../admin/subject/components/SubjectUpdate";
import SRBySubject from "../admin/supplementaryResource/components/SRBySubject";

const SubjectRoutes = ()=>{
    return(
       <Routes>
          <Route exact path="/" element={<SubjectList />}/>
            <Route path="subjects" element={<SubjectList />} /> 
            <Route path="subjectcreate" element={<SubjectCreate />} />
            <Route path="subjectupdate/:id" element={<SubjectUpdate />} />
            <Route path="supplementaryresourcebysubject/:id" element={<SRBySubject />} /> 
       </Routes>
    );
};

export default SubjectRoutes;