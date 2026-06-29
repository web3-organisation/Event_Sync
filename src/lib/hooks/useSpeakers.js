"use client";

import { useFetch } from "./useFetch";

export function useSpeakers() {
  const { data, loading, error, refetch } = useFetch("/api/speakers");

  return {
    speakers: data ?? [],
    loading,
    error,
    refetch,
  };
}

export default useSpeakers;
