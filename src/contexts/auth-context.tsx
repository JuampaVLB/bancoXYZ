import { createContext, use, useMemo, type PropsWithChildren } from 'react';

import { useStorageState } from '@/hooks/use-storage-state';
import type { AuthSession, User } from '@/lib/auth';

type AuthContextValue = {
  signIn: (session: AuthSession) => void;
  signOut: () => void;
  session: AuthSession | null;
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const parseSession = (value: string | null): AuthSession | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as AuthSession;
    if (!parsed?.token || !parsed.user) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const useSession = () => {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, sessionJson], setSessionJson] = useStorageState('session');
  const session = useMemo(() => parseSession(sessionJson), [sessionJson]);

  const value = useMemo<AuthContextValue>(
    () => ({
      signIn: (nextSession) => {
        setSessionJson(JSON.stringify(nextSession));
      },
      signOut: () => {
        setSessionJson(null);
      },
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      isLoading,
    }),
    [isLoading, session, setSessionJson],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
