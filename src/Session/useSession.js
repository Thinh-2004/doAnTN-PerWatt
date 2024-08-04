import { useState, useEffect } from "react";

const useSession = (key) => {
  const [sessionValue, setSessionValue] = useState(() => {
    return sessionStorage.getItem(key) || "";
  });

  useEffect(() => {
    if (sessionValue === "" || sessionValue === undefined) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, sessionValue);
    }
  }, [key, sessionValue]);

  const removeSessionValue = () => {
    sessionStorage.removeItem(key);
    setSessionValue("");
  };

  return [sessionValue, setSessionValue, removeSessionValue];
};

export default useSession;
