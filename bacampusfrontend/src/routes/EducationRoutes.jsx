import React from "react";
import { Routes, Route } from "react-router-dom";
import EducationCreate from "../admin/education/components/EducationCreate";
import EducationDetails from "../admin/education/components/EducationDetails";
import EducationDelete from "../admin/education/components/EducationDelete";
import EducationUpdate from "../admin/education/components/EducationUpdate";
import EducationList from "../admin/education/components/EducationList";
import Education from "../admin/education/Education";
import ESManagement from "../admin/education-subject/components/ESManagement";
import EducationSRVideoList from "../admin/education/components/EducationSRVideoList";
import EducationSROptions from "../admin/education/components/EducationSROptions";
import EducationSRDocumentaryList from "../admin/education/components/EducationSRDocumentaryList";
const EducationRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Education />} />
      <Route path="educationdetail/:id" element={<EducationDetails />} />
      <Route path="educationupdate/:id" element={<EducationUpdate />} />
      <Route path="educationcreate" element={<EducationCreate />} />
      <Route path="educationsubjectmanagement/:id" element={<ESManagement />} />
      <Route path="educationsubjectmanagement/:id" element={<ESManagement />} />
      <Route path="educationsupplamentaryresourceoptions/:id" element={<EducationSROptions />} />
      <Route path="educationsupplamentaryresourcedocumentarylist/:id" element={<EducationSRDocumentaryList />} />
      <Route path="educationsupplamentaryresourcevideolist/:id" element={<EducationSRVideoList />}   
      />
    </Routes>
  );
};
export default EducationRoutes;
