export const API_BASE_URL = process.env.BASE_URL || "http://localhost:3003";

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  HOUSES: `${API_BASE_URL}/api/house`
};
