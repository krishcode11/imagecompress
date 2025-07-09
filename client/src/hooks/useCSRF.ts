import { useState, useEffect } from 'react';
import axios from 'axios';

const generateCSRFToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export const useCSRF = () => {
  const [token, setToken] = useState<string>(() => generateCSRFToken());

  useEffect(() => {
    // Refresh token every 30 minutes
    const interval = setInterval(() => {
      setToken(generateCSRFToken());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Add CSRF token to axios requests
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
        config.headers['X-CSRF-Token'] = token;
      }
      return config;
    });
  }, [token]);

  return token;
};
