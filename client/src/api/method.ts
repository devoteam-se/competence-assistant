import getIdToken from './getToken';

const baseUrl = import.meta.env.VITE_API_URL;

export const get = async <T>(endpoint: string) => {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${await getIdToken()}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error);
  }
  return (await res.json()) as T;
};

export const put = async <T, K extends object | undefined>(endpoint: string, body?: K) => {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${await getIdToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (res.headers.get('content-type') === 'application/json') {
    return (await res.json()) as T;
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error);
  }

  return null;
};

export const post = async <T, K extends object>(endpoint: string, body: K) => {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getIdToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error);
  }

  return (await res.json()) as T;
};

// 'delete' is not allowed as a fn name
export const _delete = async <T, K extends object | undefined>(endpoint: string, body?: K) => {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${await getIdToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.headers.get('content-type') === 'application/json') {
    return (await res.json()) as T;
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || error);
  }

  return null;
};
