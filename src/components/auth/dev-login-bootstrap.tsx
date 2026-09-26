"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/store";

/** Seeds default local logins once so Sign in works without signup. */
export function DevLoginBootstrap() {
  const bootstrapDevLogins = useApp((s) => s.bootstrapDevLogins);

  useEffect(() => {
    void bootstrapDevLogins();
  }, [bootstrapDevLogins]);

  return null;
}
