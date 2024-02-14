const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';

export async function getData(query?: string) {
  const api = import.meta.env.VITE_API_URL || 'https://apiservices.chill-hub.ir';
  const res = await fetch((api + query) as string, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(`Network response was not ok: ${errorResponse.message}`);
  }
  return res.json();
}
