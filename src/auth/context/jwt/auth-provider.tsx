import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import apiDoktek, { epDoktek } from 'src/utils/axios-doktek';
//
import { authApi } from 'src/auth';
import { AuthContext } from './auth-context';
import { isValidToken, setSessionDoktek } from './utils';
import { ActionMapType, AuthStateType, AuthUserType } from '../../types';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  NEW_PASSWORD = 'NEW_PASSWORD',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.NEW_PASSWORD]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.NEW_PASSWORD) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSessionDoktek(accessToken);

        const decoded = jwtDecode<{
          sub: number;
          username: string;
          role: string;
          idRole: number;
          flag: boolean;
        }>(accessToken);

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              id_user: decoded.sub,
              username: decoded.username,
              role: decoded.role,
              idRole: decoded.idRole,
              flag: decoded.flag,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: { user: null },
        });
      }
    } catch {
      dispatch({
        type: Types.INITIAL,
        payload: { user: null },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await apiDoktek.post(epDoktek.auth.login, {
        username,
        password,
      });

      const accessToken = res.data.data.access_token;

      setSessionDoktek(accessToken);

      const decoded = jwtDecode<{
        sub: number;
        username: string;
        role: string;
        idRole: number;
        flag: boolean;
      }>(accessToken);

      dispatch({
        type: Types.LOGIN,
        payload: {
          user: {
            id_user: decoded.sub,
            username: decoded.username,
            role: decoded.role,
            idRole: decoded.idRole,
            flag: decoded.flag,
            accessToken,
          },
        },
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login gagal', { autoClose: 10000 });
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (username: string, password: string, firstName: string, lastName: string) => {
      const data = {
        username,
        password,
        firstName,
        lastName,
      };

      const res = await apiDoktek.post(epDoktek.auth.register, data);

      const { accessToken } = res.data;

      localStorage.setItem(STORAGE_KEY, accessToken);

      const user = await authApi.login({ accessToken });

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    try {
      // optional: call API logout
      // await apiDoktek.get(epDoktek.auth.logout);
      localStorage.removeItem(STORAGE_KEY);
      setSessionDoktek(null);
      dispatch({
        type: Types.LOGOUT,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // NEW password
  const newPassword = useCallback(async (username: string, code: string, password: string) => {
    const data = {
      username,
      password,
    };

    if (code !== '010101') {
      dispatch({
        type: Types.LOGOUT,
      });
    }

    const res = await apiDoktek.post(epDoktek.auth.createPassword, data);

    const { accessToken } = res.data;

    setSessionDoktek(accessToken);

    const user = await authApi.login({ accessToken });

    dispatch({
      type: Types.NEW_PASSWORD,
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      newPassword,
    }),
    [login, logout, register, newPassword, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
