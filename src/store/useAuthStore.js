import { API_ROUTES } from "../utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";



const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/register", {
            name,
            email,
            password,
          });
          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error?.response?.data?.error || "Registration failed"
            : "Registration failed";

          set({ isLoading: false, error: errorMessage });
          // RETURN the error to the caller
          return errorMessage;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
          });

          set({ isLoading: false, user: response.data.user, isAuthenticated: true });

          // Add this line to force redirect
          window.location.href = "/house/list"; // Or your dashboard route
          return true;
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error?.response?.data?.error || "Login failed"
            : "Login failed";

          set({ isLoading: false, error: errorMessage, isAuthenticated: false });
          // RETURN the error to the caller
          return errorMessage;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/logout");
          set({ user: null, isLoading: false, isAuthenticated: false });
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Logout failed"
              : "Logout failed",
          });
        }
      },
      refreshAccessToken: async () => {
        try {
          await axiosInstance.post("/refresh-token");
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
