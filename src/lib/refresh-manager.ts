// utils/refreshManager.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { getAuthCredentials } from '@/utils/auth-utils';

const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken'; // your refresh token cookie key

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const refreshAccessToken = async () => {
  try {
    const { permissions, role } = getAuthCredentials();
    const cookies = Cookies.get(AUTH_TOKEN_KEY);

    let refreshToken = '';
    if (cookies) {
      refreshToken = JSON.parse(cookies)['refresh'];
    }
    if (!refreshToken) throw new Error('No refresh token');

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/token/refresh/`,
      { refresh: refreshToken },
    );

    const newAccessToken = response.data.access;

    Cookies.set(
      AUTH_TOKEN_KEY,
      JSON.stringify({
        token: newAccessToken,
        permissions,
        role,
        refresh: refreshToken,
      }),
      {
        sameSite: 'strict',
      },
    );

    return newAccessToken;
  } catch (err) {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    throw err;
  }
};

export const handleTokenRefresh = async (error: any) => {
  if (!error.response || error.response.status !== 401) {
    return Promise.reject(error);
  }

  const originalRequest = error.config;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return axios(originalRequest);
      })
      .catch(Promise.reject);
  }

  isRefreshing = true;

  return new Promise(async (resolve, reject) => {
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
      resolve(axios(originalRequest));
    } catch (err) {
      processQueue(err, null);
      reject(err);
    } finally {
      isRefreshing = false;
    }
  });
};
