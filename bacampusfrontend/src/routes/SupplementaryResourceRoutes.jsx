import React from "react";
import { Routes, Route } from "react-router-dom";
import SRBySubject from "../admin/supplementaryResource/components/SRBySubject";
import SupplementaryResourceCreate from "../admin/supplementaryResource/components/SupplamentaryResourceCreate";
import SupplementaryResourceUpdate from "../admin/supplementaryResource/components/SupplamentaryResourceUpdate";
import SupplementaryResourceList from "../admin/supplementaryResource/components/SupplementaryResourceList";
import SupplementaryResourceDetail from "../admin/supplementaryResource/components/SupplamentaryResourceDetail";
import DeletedSupplementaryResources from "../admin/supplementaryResource/components/DeletedSupplementartyResources";
import RecoverDeletedSupplementaryResource from "../admin/supplementaryResource/components/RecoverDeletedSupplementaryResource"
import SROptions from "../student/supplementaryresources/components/SROptions";
import SRDocumentList from "../student/supplementaryresources/components/SRDocumentList";
import SRVideoList from "../student/supplementaryresources/components/SRVideoList";
import PrivateRoute from "./PrivateRoute";
import TrainerSupplementaryResourceCreate from "../trainer/supplementaryResource/components/SupplamentaryResourceCreate";
import TrainerSupplementaryResourceUpdate from "../trainer/supplementaryResource/components/SupplamentaryResourceUpdate";
import TrainerSupplementaryResourceList from "../trainer/supplementaryResource/components/SupplementaryResourceList";
import TrainerSupplementaryResourceDetail from "../trainer/supplementaryResource/components/SupplamentaryResourceDetail";
import TrainerDeletedSupplementaryResources from "../trainer/supplementaryResource/components/DeletedSupplementartyResources";
const SupplementaryResourceRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<SupplementaryResourceList />} />
      <Route
        path="supplementaryresourcebysubject/:id"
        element={<SRBySubject />}
      />
      <Route
        path="supplementaryresourcecreate"
        element={<SupplementaryResourceCreate />}
      />
      <Route
        path="supplementaryresourceupdate/:id"
        element={<SupplementaryResourceUpdate />}
      />
      <Route
        path="supplementaryresource"
        element={<SupplementaryResourceList />}
      />
      <Route
        path="supplementaryresourcedetail/:id"
        element={<SupplementaryResourceDetail />}
      />
      <Route
        path="deletedsupplementaryresources"
        element={<DeletedSupplementaryResources />}
      />
      <Route
        path="recoverdeletedresource/:id"
        element={<RecoverDeletedSupplementaryResource />}
      />
      <Route
        path="supplementaryresourceoptions"
        element={
          <PrivateRoute
            element={<SROptions />}
            allowedRoles={["Student"]}
          />
        }
      />
      <Route
        path="supplementaryresourcedocumentlist/:id"
        element={
          <PrivateRoute
            element={<SRDocumentList />}
            allowedRoles={["Student"]}
          />
        }
      />
      <Route
        path="supplementaryresourcevideolist/:id"
        element={
          <PrivateRoute
            element={<SRVideoList />}
            allowedRoles={["Student"]}
          />
        }
      />
      <Route
        path="trainersupplementaryresourcecreate"
        element={
          <PrivateRoute
            element={<TrainerSupplementaryResourceCreate />}
            allowedRoles={["Trainer"]}
          />
        }
      />{" "}
      <Route
        path="trainerdeletedsupplementaryresources"
        element={
          <PrivateRoute
            element={<TrainerDeletedSupplementaryResources />}
            allowedRoles={["Trainer"]}
          />
        }
      />{" "}
      <Route
        path="trainersupplementaryresourcedetail/:id"
        element={
          <PrivateRoute
            element={<TrainerSupplementaryResourceDetail />}
            allowedRoles={["Trainer"]}
          />
        }
      />{" "}
      <Route
        path="trainersupplementaryresourcelist"
        element={
          <PrivateRoute
            element={<TrainerSupplementaryResourceList />}
            allowedRoles={["Trainer"]}
          />
        }
      />{" "}
      <Route
        path="trainersupplementaryresourceupdate/:id"
        element={
          <PrivateRoute
            element={<TrainerSupplementaryResourceUpdate />}
            allowedRoles={["Trainer"]}
          />
        }
      />
    </Routes>
  );
};

export default SupplementaryResourceRoutes;
