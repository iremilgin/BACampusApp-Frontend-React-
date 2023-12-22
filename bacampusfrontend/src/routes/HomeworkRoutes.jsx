import React from "react";
import { Routes, Route} from "react-router-dom";
import Homework from "../admin/homework/Homework";
import HomeworkDetails from "../admin/homework/components/HomeworkDetails";
import HomeworkList from "../admin/homework/components/HomeworkList";
import HomeworkUpdate from "../admin/homework/components/HomeworkUpdate";
import HomeworkAdd from "../admin/homework/components/HomeworkAdd";
import HomeworkListTrainer from "../trainer/homework/components/HomeworkList";
import HomeworkAddTrainer from "../trainer/homework/components/HomeworkAdd";
import HomeworkDetailsTrainer from "../trainer/homework/components/HomeworkDetails";
import HomeworkUpdateTrainer from "../trainer/homework/components/HomeworkUpdate";
import PrivateRoute from "./PrivateRoute";
let userActiveRole = sessionStorage.getItem("userActiveRole");

const HomeworkRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<HomeworkList/>}/>
           <Route path="homework"element={<HomeworkList/>}/>
           <Route path="homeworkdetail/:id" element={<HomeworkDetails/>} />
           <Route path="homeworkupdate/:id" element={<HomeworkUpdate/>} />
           <Route path="homeworkcreate" element={<HomeworkAdd/>} />
           <Route exact path="/trainerhomeworkmain" element={<PrivateRoute element={<HomeworkListTrainer />} allowedRoles={['Trainer']}/>} />
           <Route path="trainerhomework"element={<PrivateRoute element={<HomeworkListTrainer />} allowedRoles={['Trainer']}/>}/>
           <Route path="trainerhomeworkcreate" element={<PrivateRoute element={<HomeworkAddTrainer />} allowedRoles={['Trainer']}/>} />
           <Route path="trainerhomeworkdetails/:id" element={<PrivateRoute element={<HomeworkDetailsTrainer />} allowedRoles={['Trainer']}/>} />
           <Route path="trainerhomeworkupdate/:id" element={<PrivateRoute element={<HomeworkUpdateTrainer />} allowedRoles={['Trainer']}/>} />
       </Routes>
    );
};

export default HomeworkRoutes;