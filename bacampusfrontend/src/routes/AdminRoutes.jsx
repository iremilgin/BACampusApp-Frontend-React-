import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminList from "../admin/admin/components/AdminList";
import AdminCreate from "../admin/admin/components/AdminCreate";
import AdminDetails from "../admin/admin/components/AdminDetails";
import AdminUpdate from "../admin/admin/components/AdminUpdate";
let savedData = sessionStorage.getItem("savedData");
let userActiveRole = sessionStorage.getItem("userActiveRole");

//Bu sayfaları admin yetkisinden başka hiç bir yetkideki kullanıcı görmesin.
//eğer farklı bir yetkide kullanıcı buraya girmek isterse null değil 401-error-page gelmeli. 

const AdminRoutes = ()=>{
    return(
       <Routes>
        
            <Route exact path="/" element={<AdminList />}/>
            <Route path="/admin" element={<AdminList />} />
            <Route path="admindetail/:id" element={<AdminDetails />} />
            <Route path="admincreate" element={<AdminCreate />} />
            <Route path="adminupdate/:id" element={<AdminUpdate />} />
           
       </Routes>
    );
};

export default AdminRoutes;