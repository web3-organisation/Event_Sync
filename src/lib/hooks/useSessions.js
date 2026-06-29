"use client";

import { useFetch } from "./useFetch";
import { useEffect, useRef } from "react";

export function useSessions({ pollInterval = 0 } = {}) {
  const { data, loading, error, refetch } = useFetch("/api/sessions");

  const timerRef = useRef(null);
  useEffect(() => {
    if (pollInterval > 0) {
      timerRef.current = setInterval(refetch, pollInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pollInterval, refetch]);

  return {
    sessions: data ?? [],
    loading,
    error,
    refetch,
  };
}

export default useSessions;
