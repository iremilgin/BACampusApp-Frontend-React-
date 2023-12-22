import React from 'react'
import { Route, Routes } from 'react-router-dom'
import BranchList from '../admin/branch/components/BranchList'
import BranchCreate from '../admin/branch/components/BranchCreate'
import BranchUpdate from '../admin/branch/components/BranchUpdate'

const BranchRoutes = () => {
  return (
    <div>
        <Routes >
            <Route exact path='/' element={<BranchList />} />
            <Route path='branch' element={<BranchList />} />
            <Route path='branchcreate' element={<BranchCreate />} />
            <Route path='branchupdate/:id' element={<BranchUpdate />} />
        </Routes>
    </div>
  )
}

export default BranchRoutes