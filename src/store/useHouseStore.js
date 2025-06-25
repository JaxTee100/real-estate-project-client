import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";





export const useHouseStore = create((set, get) => {
  const { isAuthenticated } = useAuthStore.getState();
  const hasCookie = document.cookie.includes('accessToken'); // Quick check

  return {
    houses: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalHouses: 0,

    fetchAllHouses: async () => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.get(`${API_ROUTES.HOUSES}/get-all-houses`, {
          withCredentials: true,
        });
        console.log("is it authenticated?", isAuthenticated);
        set({ houses: response.data, isLoading: false });
      } catch (e) {
        set({ error: "Failed to fetch houses", isLoading: false });
      }
    },

    createHouse: async (houseData) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.post(
          `${API_ROUTES.HOUSES}/create-new-house`,
          houseData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        set((state) => ({
          houses: [...state.houses, response.data.house],
          isLoading: false,
        }));

        return response.data.house;
      } catch (e) {
        set({ error: "Failed to create house", isLoading: false });
        throw e;
      }
    },

    deleteHouse: async (id) => {
      set({ isLoading: true, error: null });

      try {
        await axios.delete(`${API_ROUTES.HOUSES}/delete-house/${id}`, {
          withCredentials: true,
        });

        set((state) => ({
          houses: state.houses.filter((house) => house.id !== id),
          isLoading: false,
        }));

        return true;
      } catch (e) {
        set({ error: "Failed to delete house", isLoading: false });
        throw e;
      }
    },

    updateHouse: async (id, formData) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.put(
          `${API_ROUTES.HOUSES}/update-house/${id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const updatedHouse = {
          ...response.data.house,
          images: response.data.house?.images || [],
        };

        set((state) => ({
          houses: state.houses.map((house) =>
            house.id === id ? updatedHouse : house
          ),
          isLoading: false,
        }));

        return response.data;
      } catch (e) {
        set({
          error: e.response?.data?.message || "Failed to update house",
          isLoading: false,
        });
        throw e;
      }
    },

    getHouseById: async (id) => {
      set({ isLoading: true, error: null });

      try {
        const response = await axios.get(`${API_ROUTES.HOUSES}/get-house/${id}`, {
          withCredentials: true,
        });

        set({ isLoading: false });
        return response.data.house;
      } catch (e) {
        set({ error: "Failed to get house", isLoading: false });
        throw e;
      }
    },

    fetchClientHouses: async (params) => {
      
      set({ isLoading: true, error: null });

      try {
        const queryParams = {
          ...params,
          estateTypes: params.estateTypes?.join(","),
        };

        const response = await axios.get(`${API_ROUTES.HOUSES}/client-houses`, {
          params: queryParams,
          withCredentials: true,
        });

        set({
          houses: response.data.houses,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalHouses: response.data.totalHouses,
          isLoading: false,
        });
      } catch (e) {
        set({ error: "Failed to fetch Houses", isLoading: false });
      }
    },

    setCurrentPage: (page) => set({ currentPage: page }),
  };
});
