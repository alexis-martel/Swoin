"use client";

import { useEffect, useState } from "react";

export type SessionUser = {
  id: number;
  email: string;
  balance: string;
};

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { user?: SessionUser };
        return data.user ?? null;
      })
      .then((nextUser) => {
        if (active) setUser(nextUser);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return user;
}
