"use client";

import { useFetch } from "./useFetch";

export function useRooms() {
  const { data, loading, error, refetch } = useFetch("/api/rooms");

  return {
    rooms: data ?? [],
    loading,
    error,
    refetch,
  };
}

export default useRooms;
