import React from "react";
import { Routes, Route} from "react-router-dom";
import TagList from "../admin/tag/components/TagList";
import TagCreate from "../admin/tag/components/TagCreate";
import TagDeletedList from "../admin/tag/components/TagDeletedList";
import TagUpdate from "../admin/tag/components/TagUpdate";

const TagRoutes = ()=>{
    return(
       <Routes>
           <Route exact path="/" element={<TagList />} />
            <Route path="tagcreate" element={<TagCreate />} />
            <Route path="tagupdate/:id" element={<TagUpdate />} />
            <Route path="tagdeletedlist" element={<TagDeletedList />} />
            <Route path="tags" element={<TagList />} />
       </Routes>
    );
};

export default TagRoutes;