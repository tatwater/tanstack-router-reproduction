import { getUrl } from '@/lib/api';

export async function signin(props: {
  email: string;
  password: string;
}) {
  const url = getUrl('/auth');
  const base64creds = btoa(`${props.email}:${props.password}`);

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${base64creds}`,
    },
    credentials: 'include',
  });
}

export async function signout() {
  const url = getUrl('/auth/logout');

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function whoami() {
  const url = getUrl('/auth/whoami');

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
}
