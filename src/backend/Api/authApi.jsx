import connection from "../connection";

export default function authApi(path, data = {}) {
  switch (path) {
    case "/signin":
      return connection("/authenticate", data);

    case "/session_verification":
      return connection("/validate/session", data);

    case "/signOut":
      return connection("/signOut", data);

    default:
      return Promise.reject(new Error(`Unknown auth path: ${path}`));
  }
}
