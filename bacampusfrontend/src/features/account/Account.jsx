import { Login } from "./components/Login";
import { createRoleLog } from "./api/accountApi";
import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { useSession } from "../../helper/SessionContext";

let savedData = sessionStorage.getItem("savedData");
async function RoleLog(activeRole) {
  try {    
    const newRoleLog = await createRoleLog({
      activeRole,
      actionType: 1
    });
    console.log(newRoleLog);   
  } catch (error) {
    console.error("Hata:", error);
  }
}

function Account() {

  const navigate = useNavigate();
  const { sessionData, updateSessionData } = useSession();

  const handleUpdateSession = () => {
    const newData = sessionStorage.getItem("savedData");
    updateSessionData(newData);
  }

  useEffect(() => {
    let savedData = sessionStorage.getItem("savedData");
    let userActiveRole = sessionStorage.getItem("userActiveRole");

    if (userActiveRole != null && savedData != null) {
      savedData = savedData.split(",");
      savedData[1] = userActiveRole;
      sessionStorage.setItem("savedData", savedData.join(","));
      // if (userActiveRole == "Admin") {
      //   navigate("/admin");
      // } else if (userActiveRole == "Trainer") {
      //   navigate("/trainer");
      // } else if (userActiveRole == "Student") {
      //   navigate("/student");
      // }
    }
    let savedRoleLog = sessionStorage.getItem("savedRoleLog");

    if (savedRoleLog != 1 && savedData != null) {
      savedData = savedData.split(",");
      RoleLog(savedData[1]);
      sessionStorage.setItem("savedRoleLog", 1);
    }
    handleUpdateSession();
    if (savedData != null && savedData[1] == "Admin") {
      navigate("/admin");
    } else if (savedData != null && savedData[1] == "Trainer") {
      navigate("/trainer");
    } else if (savedData != null && savedData[1] == "Student") {
      navigate("/student");
    }
  }, []); 

  if (savedData == null) {
    return (
      <>
        <Login />
      </>
    );
  }
}

export default Account;

