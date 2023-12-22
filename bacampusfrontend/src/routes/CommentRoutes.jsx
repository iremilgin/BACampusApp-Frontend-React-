import React from "react";
import { Routes, Route} from "react-router-dom";

import CommentList from "../admin/adminComment/components/CommentList";
import CommentDetails from "../admin/adminComment/components/CommentDetails";
import CommentUpdate from "../admin/adminComment/components/CommentUpdate";


const CommentRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<CommentList />}/>
           {/* <Route path="comments" element={<CommentList />} /> */}
            {/* <Route path="commentdetails/:id" element={<CommentDetails />} /> */}
            <Route
              path="commentupdate/:id"
              element={<CommentUpdate />}
            />
       </Routes>
    );
};

export default CommentRoutes;