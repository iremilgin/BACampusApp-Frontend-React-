import React from 'react'
import { Routes, Route} from "react-router-dom";
import TrainingTypeList from "../admin/trainingType/components/TrainingTypeList.jsx"
import TrainingTypeCreate from '../admin/trainingType/components/TrainingTypeCreate';
import TrainingTypeUpdate from '../admin/trainingType/components/TrainingTypeUpdate.jsx';

const TrainingTypeRoutes = () => {
  return (
    <div>
        <Routes>
            <Route exact path='/' element={<TrainingTypeList />} />
            <Route path='trainingtype' element={<TrainingTypeList />} />
            <Route path='trainingtypecreate' element={<TrainingTypeCreate />} />
            <Route path='trainingtypeupdate/:id' element={<TrainingTypeUpdate />} />
        </Routes>
    </div>
  )
}

export default TrainingTypeRoutes