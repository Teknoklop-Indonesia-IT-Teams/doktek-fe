// routes
// import { jwtDecode } from 'jwt-decode';
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';
import apiDoktek from 'src/utils/axios-doktek';

// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken || typeof accessToken !== 'string') {
    return false;
  }

  try {
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// ----------------------------------------------------------------------

// export const tokenExpired = (exp: number) => {
//   // eslint-disable-next-line prefer-const
//   let expiredTimer;

//   const currentTime = Date.now();

//   // Test token expires after 10s
//   // const timeLeft = currentTime + 10000 - currentTime; // ~10s
//   const timeLeft = exp * 1000 - currentTime;

//   clearTimeout(expiredTimer);

//   expiredTimer = setTimeout(() => {
//     alert('Token expired');

//     sessionStorage.removeItem('accessToken');

//     window.location.href = paths.auth.jwt.login;
//   }, timeLeft);
// };

// ----------------------------------------------------------------------

export const setSessionDoktek = (accessToken: string | null) => {
  if (accessToken !== null) {
    localStorage.setItem('accessToken', accessToken);

    apiDoktek.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // const { exp } = jwtDecode(accessToken);
    // tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('users');

    delete apiDoktek.defaults.headers.common.Authorization;
  }
};
