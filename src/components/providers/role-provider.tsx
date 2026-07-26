import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { can, roleMeta, type Permission, type Role } from "@/lib/roles";

const STORAGE_KEY = "twintech.role";

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  can: (permission?: Permission | null) => boolean;
  label: string;
};

const RoleContext = createContext<RoleContextValue | null>(null);

function isRole(value: string | null): value is Role {
  return !!value && value in roleMeta;
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("owner");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isRole(stored)) setRoleState(stored);
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      setRole,
      can: (permission) => can(role, permission),
      label: roleMeta[role].label,
    }),
    [role, setRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}