/* eslint-disable class-methods-use-this */
import { jwtDecode } from 'jwt-decode';

import apiDoktek, { epDoktek } from 'src/utils/axios-doktek';
import type { AuthUser, IAuthRequest } from './types';

const STORAGE_KEY = 'users';

// NOTE: We use sessionStorage since memory storage is lost after page reload.
//  This should be replaced with a server call that returns DB persisted data.

async function getPersistedUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function persistUser(newUser: AuthUser) {
  try {
    const prevUsers: AuthUser[] = await getPersistedUsers();
    const users = prevUsers.filter((u) => u.id_user !== newUser.id_user);
    const mergeUser = [...users, newUser];
    const data = JSON.stringify(mergeUser);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (err) {
    console.error(err);
  }
}

class AuthApi {
  async signIn(request: { username: string; password: string }) {
    const { username, password } = request;

    try {
      const { data } = await apiDoktek.post(epDoktek.auth.login, {
        username,
        password,
      });

      const { accessToken } = data;

      return { accessToken };
    } catch (err) {
      console.error('[Auth Api]: ', err);
      throw new Error('Internal server error');
    }
  }

  async signUp(request: IAuthRequest): Promise<{ accessToken: string }> {
    const { username, password } = request;

    try {
      // Merge static users (data file) with persisted users (browser storage)
      // const mergedUsers = [...users, ...getPersistedUsers()];
      const mergedUsers: AuthUser[] = await getPersistedUsers();

      // Check if a user already exists
      const user = mergedUsers.find((usr) => usr.username === username);

      if (user) {
        throw new Error('User already exists');
      }
      const { data } = await apiDoktek.post(epDoktek.auth.register, {
        username,
        password,
      });

      const { accessToken } = data;

      return { accessToken };
    } catch (err) {
      console.error('[Auth Api]: ', err);
      throw new Error('Internal server error');
    }
  }

  async login(request: { accessToken: string }) {
    const { accessToken } = request;

    const decoded = jwtDecode<{ id_user: string }>(accessToken);
    const { id_user } = decoded;

    try {
      const { data } = await apiDoktek.post(epDoktek.auth.login);

      await persistUser(data);

      const mergedUsers: AuthUser[] = await getPersistedUsers();

      const user = mergedUsers.find((u) => u.id_user === id_user);

      if (!user) {
        throw new Error('Invalid authorization token');
      }

      return user;
    } catch (err) {
      console.error('[Auth Api]: ', err);
      throw new Error('[login] Internal server error');
    }
  }

  async signOut() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      await apiDoktek.get(epDoktek.auth.logout);
    } catch (err) {
      console.error('[Auth Api]: ', err);
      throw new Error('Internal server error');
    }
  }
}

export const authApi = new AuthApi();
