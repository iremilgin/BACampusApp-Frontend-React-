import React from "react";
import { Routes, Route } from "react-router-dom"; 

import ErrorPage from "../shared/error-boundary/ErrorPage";

const ErrorRoutes = ()=>{
    return(
       <Routes>
            <Route exact path="/" element={<ErrorPage/>}/>
            <Route path="error" element={<ErrorPage />}/>
       </Routes>
    );
};

export default ErrorRoutes;