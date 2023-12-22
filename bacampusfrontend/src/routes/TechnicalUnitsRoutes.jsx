import React from "react";
import { Routes, Route} from "react-router-dom";

import TechnicalUnitCreate from "../admin/technicalunit/components/TechnicalUnitCreate";
import TechnicalUnitUpdate from "../admin/technicalunit/components/TechnicalUnitUpdate";
import TechnicalUnitList from "../admin/technicalunit/components/TechnicalUnitList";
import TechnicalUnit from "../admin/technicalunit/TechnicalUnit";

const TechnicalUnitsRoutes = ()=>{
    return(
       <Routes>
          <Route exact path="/" element={<TechnicalUnitList />}/>
            <Route path="technicalunits" element={<TechnicalUnit />} />
            <Route
              path="technicalunitcreate" element={<TechnicalUnitCreate />}
            />
            <Route path="technicalunitupdate/:id" element={<TechnicalUnitUpdate />}
            />
            {/* <Route path="technicalunitlist" element={<TechnicalUnitList />} /> */}
       </Routes>
    );
};

export default TechnicalUnitsRoutes;