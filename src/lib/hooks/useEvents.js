"use client";

import { useFetch } from "./useFetch";

export function useEvents() {
  const { data, loading, error, refetch } = useFetch("/api/events");

  return {
    events: data ?? [],
    loading,
    error,
    refetch,
  };
}

export default useEvents;
