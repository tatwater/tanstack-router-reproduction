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
  signOut: (redirect?: () => void) => Promise<void>;
  onSignInSuccess: (
    redirect: (destination: string) => void,
    destination: string,
  ) => void;
  refreshUser: () => void;
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

  const signOut = useCallback(async (redirect?: () => void) => {
    setIsLoading(true);

    localStorage.removeItem('user');
    await api.signout();
    setUser(null);

    setIsLoading(false);

    if (redirect) {
      redirect();
    }
  }, [setIsLoading, setUser]);

  const onSignInSuccess = useCallback(async (redirect: (destination: string) => void, destination: string) => {
    setIsLoading(true);

    await refreshUserInStorage(setUser);

    setIsLoading(false);

    if (redirect) {
      redirect(destination);
    }
  }, [setIsLoading]);

  const refreshUser = useCallback(() => {
    refreshUserInStorage(setUser);
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
