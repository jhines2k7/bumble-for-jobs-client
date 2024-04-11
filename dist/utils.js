import { DOMAIN } from './constants.js';

export function isTokenExpired() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Date.now() / 1000; // Convert to seconds
    if (now > expiry) {
      console.debug("Token has expired");

      return true;
    }
  } else {
    logout(); // No token found, log the user out
  }
}

export async function refreshAccessToken() {
  try {
    console.debug('Refreshing access token...')

    const response = await fetch(`${DOMAIN}/token/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 500) {
        router.navigate('/login');
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);

    throw error;
  }
}

export function logout() {
  fetch(`${domain}/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  }).then(response => {
    if (!response.ok) {
      // Remove the token from localStorage  
      localStorage.removeItem('access_token');
      // Redirect the user to the login page or home page
      router.navigate('/login');

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Remove the token from localStorage  
    localStorage.removeItem('access_token');
    // Redirect the user to the login page or home page
    router.navigate('/login');
  });
}

export function parseJwt(token) {
  try {
    // Split the token into its parts
    const base64Url = token.split('.')[1];
    // Replace URL-safe characters and decode
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    // Parse the decoded payload
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}