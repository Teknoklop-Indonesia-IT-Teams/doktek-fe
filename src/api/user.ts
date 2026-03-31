import { useMemo } from 'react';
import useSWR from 'swr';
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';
import { Profile } from 'src/types/schema';

export function useGetUsers() {
  const URL = epDoktek.users.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      users: (data?.data as Profile[]) || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserById(id: string) {
  const URL = id ? epDoktek.users.details(id) : null;

  const { data, isLoading, error } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      user: data?.data as any,
      userLoading: isLoading,
      userError: error,
    }),
    [data?.data, error, isLoading]
  );

  return memoizedValue;
}
