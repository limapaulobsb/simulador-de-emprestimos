import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

type Props = {
  children: ReactNode;
};

type UserContextValue = {
  name: string;
  setName: (name: string) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: Props) {
  const [name, setName] = useState<string>("");
  const value = useMemo(() => ({ name, setName }), [name]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return ctx;
}
