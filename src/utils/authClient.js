export async function SignIn({ auth: { token } }) {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error setting cookies:", error);
    return false;
  }
}

export async function SignOut() {
  try {
    const res = await fetch('/api/auth', { method: 'DELETE' });
    return res.ok;
  } catch (error) {
    console.error("Error deleting cookies:", error);
    return false;
  }
}

export async function useIsAuthenticated() {
  try {
    const res = await fetch('/api/auth', { method: 'GET' });
    const data = await res.json();
    return data.authenticated;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

async function refresh(url) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) return false;

    const data = await res.json();
    return await SignIn({ auth: { token: data.token } });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export function createRefresh({ interval = 10, url }) {
  try {
    if (!url) throw new Error("URL is required for token refresh.");

    setInterval(async () => {
      const isAuthenticated = await useIsAuthenticated();
      if (isAuthenticated) {
        await refresh(url);
      }
    }, interval * 1000);
  } catch (error) {
    console.error("Error creating refresh interval:", error);
  }
}
