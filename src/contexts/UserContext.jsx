import React, { useState, useEffect, createContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { getAdminPermissions } from "../requests/admins";
// utils
import { getDataForTableRows } from "../utils/tables";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  // states
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedStatus = localStorage.getItem("isLoggedIn");
    return storedStatus === "true";
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const verifyToken = async (token) => {
    try {
      const response = await fetch(
        "https://erp.eaacgroup.org/api/auth/checkToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      if (response.status == 200) {
        return true;
      }
    } catch (error) {
      console.error("Token verification failed", error);
    }
    return false;
  };

  const initialize = async () => {
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        setIsLoggedIn(true);
      } else {
        logout(); // Invalid token, perform logout
      }
    }
  };

  // Initialize authentication state when the component mounts
  useEffect(() => {
    initialize();
  }, []);

  // Update localStorage whenever isLoggedIn, token, or user changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }, [isLoggedIn, token, user]);

  const login = (authToken, userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser({});
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Get user permissions
  const { data: userPermissionsList, isLoading: userPermissionsLoading } =
    useQuery({
      queryFn: () =>
        getAdminPermissions(
          { numOfElements: "2000", userId: user?.id },
          token,
          {
            isFormData: true,
          }
        ),
      queryKey: ["userPermissionsList", user?.id],
    });

  const userPermissionsObjects = getDataForTableRows(
    userPermissionsList?.success?.response?.data
  )[0]?.Permissions;

  const userPermissions = userPermissionsObjects?.map((ele) => ele?.Name_en);

  const hasPermission = (_permissionString) => {
    if (!Array.isArray(userPermissions) || userPermissions?.length == 0) return;
    // return userPermissions?.includes(_permissionString);
    return true;
  };

  const value = { isLoggedIn, user, token, login, logout, hasPermission };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
