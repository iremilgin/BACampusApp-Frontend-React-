import React from 'react'
import { Routes, Route} from "react-router-dom";
import GroupTypeList from "../admin/gruopType/components/GroupTypeList.jsx"
import GroupTypeCreate from '../admin/gruopType/components/GroupTypeCreate.jsx';
import GroupTypeUpdate from '../admin/gruopType/components/GroupTypeUpdate.jsx';



const GroupTypeRoutes = () => {
  return (
    <div>
        <Routes>
            <Route exact path='/' element={<GroupTypeList />} />
            <Route path='grouptype' element={<GroupTypeList />} />
            <Route path='grouptypecreate' element={<GroupTypeCreate />} />
            <Route path='grouptypeupdate/:id' element={<GroupTypeUpdate />} />
        </Routes>
    </div>
  )
}

export default GroupTypeRoutes