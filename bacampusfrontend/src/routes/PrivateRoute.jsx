import { Navigate } from "react-router-dom";
import { useSession } from "../helper/SessionContext"; 
import { logout } from "../features/account/api/accountApi";

const PrivateRoute = ({ element, allowedRoles }) => {
   const { sessionData } = useSession(); 
   if (sessionData != null && allowedRoles.includes(sessionData.split(',')[1])) {
      return element;
   } else{
      logout();
      sessionStorage.removeItem('savedData');
      localStorage.clear();
      sessionStorage.clear();
      return <Navigate to="/error" />;
   }
};

export default PrivateRoute;
