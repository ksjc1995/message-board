import { ApisauceConfig, ApisauceInstance, create } from "apisauce";

let apiClient: ApisauceInstance;

const config: ApisauceConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { Authorization: process.env.REACT_APP_API_TOKEN },
};

export const getApiClient = (): ApisauceInstance => apiClient;

export const createApiClient = (): ApisauceInstance => {
  apiClient = create(config);
  return apiClient;
};
