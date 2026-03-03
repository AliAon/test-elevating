import { useState, useEffect } from "react";

export function useUserType() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    if (parsedUser) setUserType(parsedUser?.user_type_name);

    const handleStorageChange = (event) => {
      if (event.key === "user") {
        const updatedUser = JSON.parse(event.newValue);
        setUserType(updatedUser?.user_type_name);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return userType;
}

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    if (parsedUser) setUser(parsedUser);

    const handleStorageChange = (event) => {
      if (event.key === "user") {
        const updatedUser = JSON.parse(event.newValue);
        setUser(updatedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return user;
}
