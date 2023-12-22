import React from "react";
import { Routes, Route } from "react-router-dom";
import SubCategoryCreate from "../admin/category/components/SubCategoryCreate";
import SubCategoryList from "../admin/category/components/SubCategoryList";
import SubCategoryUpdate from "../admin/category/components/SubCategoryUpdate";


const SubCategoryRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<SubCategoryList />} />
      <Route path="subcategorycreate" element={<SubCategoryCreate />} />
      <Route path="subcategoryupdate/:id" element={<SubCategoryUpdate />} />

    </Routes>
  );
};

export default SubCategoryRoutes;
