import { useState, useEffect } from "react";

const useSession = (key) => {
  const [sessionValue, setSessionValue] = useState(() => {
    return sessionStorage.getItem(key) || "";
  });

  useEffect(() => {
    sessionStorage.setItem(key, sessionValue);
  }, [key, sessionValue]);

  const removeSessionValue = () => {
    sessionStorage.removeItem(key);
    setSessionValue("");
  };

  return [sessionValue, setSessionValue, removeSessionValue];
};

export default useSession;
