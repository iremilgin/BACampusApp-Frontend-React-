import React from "react";
import { Routes, Route} from "react-router-dom";
import CategoryList from "../admin/category/components/CategoryList";
import CategoryCreate from "../admin/category/components/CategoryCreate";
import CategoryUpdate from "../admin/category/components/CategoryUpdate";
import CategoryDetails from "../admin/category/components/CategoryDetails";
import SubCategoryCreate from "../admin/category/components/SubCategoryCreate";



const CategoryRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<CategoryList />}/>
           <Route path="categorycreate" element={<CategoryCreate/>} />
           <Route path="categoryupdate/:id" element={<CategoryUpdate/>} />
           <Route path="categorydetails/:id" element={<CategoryDetails/>} />
           <Route path="categorydetails/:id/categorydetails/:id/subcategoryCreate" element={<SubCategoryCreate/>} />
       </Routes>
    );
};

export default CategoryRoutes;