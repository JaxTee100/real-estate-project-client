import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";




export const useHouseStore = create((set, get) => ({
  houses: [],
  isLoading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalHouses: 0,
  fetchAllHouses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.HOUSES}/get-all-houses`,
        {
          withCredentials: true,
        }
      );

      set({ houses: response.data.data, isLoading: false });
    } catch (e) {
      set({ error: "Failed to fetch product", isLoading: false });
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (e) {
      set({ error: "Failed to create House", isLoading: false });
    }
  },
  updateHouse: async (id, houseData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.HOUSES}/${id}`,
        houseData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (e) {
      set({ error: "Failed to update House", isLoading: false });
    }
  },
  deleteHouse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.HOUSES}/delete-house/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.success;
    } catch (e) {
      set({ error: "Failed to Delete House", isLoading: false });
    }
  },
  getHouseById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.HOUSES}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data.data;
    } catch (e) {
      set({ error: "Failed to get the house", isLoading: false });
      return null;
    }
  },
  fetchClientHouses: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = {
        ...params,
        estateTypes: params.estateTypes.join(",")
      };

      const response = await axios.get(
        `${API_ROUTES.HOUSES}/client-houses`,
        {
          params: queryParams,
          withCredentials: true,
        }
      );

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
}));
