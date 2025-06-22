export function getToken(): string | null {
  return localStorage.getItem('@App:token');
}

export function setToken(token: string) {
  localStorage.setItem('@App:token', token);
}

export function removeToken() {
  localStorage.removeItem('@App:token');
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch (e) {
    return true;
  }
}
