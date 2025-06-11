import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";




export const useHouseStore = create((set, get) => ({
  houses: [],
  isLoading: false,
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

      set({ houses: response.data, isLoading: false });
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Optimistically update the state with the new house
      set((state) => ({
        houses: [...state.houses, response.data.house], // Match backend response
        isLoading: false,
      }));

      return response.data.house;
    } catch (e) {
      set({ error: "Failed to create house", isLoading: false });
      throw e; // Let components handle the error
    }
  },

  // Fixed: Updates state after deletion
  deleteHouse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_ROUTES.HOUSES}/delete-house/${id}`, {
        withCredentials: true,
      });

      // Remove the deleted house from state
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

  // Fixed: Updates state after edit
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

    if (!response?.data.success) {
      set({error: response?.data?.message, isLoading: false});
    }

    // Ensure images array exists in response
    const updatedHouse = {
      ...response.data.house,
      images: response.data.house?.images || []
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
      isLoading: false 
    });
    throw e;
  }
},
  // In useHouseStore.js
  deleteHouse: async (id) => {
    set({ isLoading: true });
    try {
      // Optimistic update - remove immediately
      set((state) => ({
        houses: state.houses.filter(house => house.id !== id)
      }));

      await axios.delete(`${API_ROUTES.HOUSES}/delete-house/${id}`, {
        withCredentials: true
      });

      return true;
    } catch (e) {
      // Revert if failed
      set((state) => ({ houses: state.houses }));
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
      return response.data.house; // Ensure this matches backend response
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
