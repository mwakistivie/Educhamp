import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useClerkAuth = () => {
  const { getToken, userId } = useAuth();
  const { user } = useUser();

  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const apiCall = async (method, endpoint, data = null) => {
    try {
      const headers = await getAuthHeader();
      const config = {
        method,
        url: `${API_URL}${endpoint}`,
        headers
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const syncUserRole = async (role) => {
    try {
      await apiCall('patch', `/clerk/update-role/${userId}`, { role });
      return true;
    } catch (error) {
      console.error('Failed to update role:', error);
      return false;
    }
  };

  return {
    getAuthHeader,
    apiCall,
    syncUserRole,
    userId,
    user
  };
};
