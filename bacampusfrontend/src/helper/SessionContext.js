import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [sessionData, setSessionData] = useState(null);

  const updateSessionData = (newData) => {
    if(newData != null){
      setSessionData(newData);
      //sessionStorage.setItem("savedData", newData);
    }
  };

  return (
    <SessionContext.Provider value={{ sessionData, updateSessionData }}>
      {children}
    </SessionContext.Provider>
  );
}
