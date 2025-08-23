"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type LoaderContextType = {
  bootDone: boolean;
  setBootDone: (val: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [bootDone, setBootDone] = useState(false);
  return (
    <LoaderContext.Provider value={{ bootDone, setBootDone }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used within LoaderProvider");
  return ctx;
}
