export function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = payload.exp;
  const now = Date.now() / 1000; // Convert to seconds
  if (now > expiry) {
    console.debug("Token has expired");

    return true;
  } else {
    return false;
  }
}

export async function refreshAccessToken(refreshToken) {
  try {
    console.debug('Refreshing access token...')

    const response = await fetch(`${DOMAIN}/token/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);

    throw error;
  }
}

/*export function logout() {
  const token = localStorage.getItem('access_token');
  console.log('Router', window.router);

  if (token) {
    fetch(`${DOMAIN}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).then(response => {
      // Remove the token from localStorage  
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      window.router.navigate('/login');
    });
  } else {
    console.info('No access token found, routing to login page...');
    window.router.navigate('/login');
  }
}*/

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

export function toSentenceCase(str) {
  // Split the string into an array of words
  let words = str.split('_');

  // Capitalize the first letter of the first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  // Join the words back into a string with spaces
  return words.join(' ');
}

export function updateFixedElementSizeAndPosition() {
  const parent = document.getElementById('app');
  const rect = parent.getBoundingClientRect(); // Get position & size of parent

  const fixedElement = document.querySelector('#chat-zone .chat-messages');

  if (fixedElement) {
    // Set size and position to match parent
    // fixedElement.style.width = `${rect.width}px`;
    fixedElement.style.height = `${rect.height}px`;
    // fixedElement.style.top = '60px';
    // fixedElement.style.left = `${rect.left}px`;
  } else {
    console.error('Fixed element not found');
  }
}