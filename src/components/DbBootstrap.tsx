"use client";

import { useEffect } from "react";
import { ensureSeed } from "@/lib/db";

export function DbBootstrap() {
  useEffect(() => {
    ensureSeed().catch((err) => {
      console.error("[db] seed falhou:", err);
    });
  }, []);
  return null;
}