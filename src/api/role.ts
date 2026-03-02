import { useMemo } from 'react';
import useSWR from 'swr';
// utils
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';
// types
import type { IRole } from 'src/types/role';

// ----------------------------------------------------------------------

export function useGetRoles() {
  const URL = epDoktek.roles.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      roles: (data?.data as IRole[]) || [],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetRolesDetails(roleId: string) {
  const URL = roleId ? epDoktek.roles.details(roleId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      roles: data?.data as IRole,
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchRoles(query: unknown) {
  const URL = query ? [epDoktek.roles.search, { params: query }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    // keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: {
        roles: (data?.roles as IRole[]) || [],
        count: (data?.count as number) || 0,
      },
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.roles?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
