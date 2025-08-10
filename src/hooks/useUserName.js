import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "./useAuth";
import generateUsernameFromEmail from "../utils/generateUsernameFromEmail";

const useUserName = () => {
  const { auth } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (auth?.user?.email) {
      const cachedUsername = localStorage.getItem("userName");

      if (cachedUsername) {
        setUserName(cachedUsername);
      } else {
        const userName = generateUsernameFromEmail(auth?.user?.email);
        setUserName(userName);
        localStorage.setItem("username", userName);
      }
    }
  }, [auth?.user?.email]);

  return userName;
};

export default useUserName;
