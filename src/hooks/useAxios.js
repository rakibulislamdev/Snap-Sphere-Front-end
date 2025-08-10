import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { api } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAxios = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        const accessToken = auth?.accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = auth?.refreshToken;

            if (!refreshToken) {
              console.log("No refresh token available. Logging out.");
              setAuth(null);
              navigate("/login");
              return Promise.reject(error);
            }

            const response = await axios.post(
              `${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh-token`,
              {
                refreshToken,
              }
            );

            const { accessToken, refreshToken: newRefreshToken } =
              response.data;

            setAuth((prev) => ({
              ...prev,
              accessToken,
              refreshToken: newRefreshToken || refreshToken,
              user: prev?.user,
            }));

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
          } catch (error) {
            console.error("Error refreshing token:", error);
            toast.error("Session expired. Please log in again.");
            setAuth(null);
            navigate("/login");
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.accessToken, auth?.refreshToken, setAuth, navigate]);

  return { api };
};

export default useAxios;
