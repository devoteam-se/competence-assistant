import { firebase, AuthUser } from '@/firebase';
import { User } from '@competence-assistant/shared';
import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LoadingIndicator } from '@/components/LoadingIndicator';

type AuthContextProps = {
  currentUser: User | null;
  signIn: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const toUser = async (authUser: AuthUser | null) => {
  if (!authUser) return null;
  const { claims } = await authUser.getIdTokenResult();
  return {
    id: String(claims.user_id),
    name: String(claims.name),
    photoUrl: String(claims.picture),
    email: String(claims.email),
    admin: Boolean(claims.admin || false),
  };
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(async (authUser) => {
      setLoading(true);
      const user = await toUser(authUser);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    await firebase.signIn();
  }, []);

  const signOut = useCallback(async () => {
    await firebase.signOut();
    queryClient.clear();
  }, [queryClient]);

  const authContextValue: AuthContextProps = useMemo(
    () => ({
      currentUser,
      signIn,
      signOut,
    }),
    [currentUser, signIn, signOut],
  );

  if (loading) return <LoadingIndicator />;

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
