import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { User } from '@/types/user';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '@/lib/api';
import {
  getCurrentSessionUserInfo,
  isUserAuthenticated,
  loadUserFromStorage,
  refreshUserInStorage,
} from '@/lib/auth-helpers';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  onSignInSuccess: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthProvider(props: {
  children: ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());
  const isAuthenticated = isUserAuthenticated();

  const signOut = useCallback(async () => {
    setIsLoading(true);

    localStorage.removeItem('user');
    await api.signout();
    setUser(null);

    setIsLoading(false);
  }, [setIsLoading, setUser]);

  const onSignInSuccess = useCallback(async () => {
    setIsLoading(true);

    await refreshUserInStorage(setUser);

    setIsLoading(false);
  }, [setIsLoading]);

  const refreshUser = useCallback(async () => {
    await refreshUserInStorage(setUser);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentSessionUserInfo();

      if (user) {
        setUser(user);
      }

      setIsLoading(false);
    }

    if (isLoading) {
      fetchUser();
    }
  }, [isAuthenticated, isLoading, setUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signOut,
        onSignInSuccess,
        refreshUser,
        setUser,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}


function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export {
  AuthProvider,
  useAuth,
}
