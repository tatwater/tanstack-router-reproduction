import {
  signin,
  signout,
  whoami,
} from './auth'

export function getUrl(endpoint: string) {
  const url = import.meta.env.VITE_API_PREFIX + "/v1" + endpoint;
  return url;
}

export default {
  signin,
  signout,
  whoami,
}
