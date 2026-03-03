import { useMemo } from 'react';
import useSWR from 'swr';
// types
import type { IDivision } from 'src/types/division';
//utils
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';

// ----------------------------------------------------------------------

export function useGetDivision() {
  const URL = epDoktek.division.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      division: (data?.data as IDivision[]) || [],
      divisionLoading: isLoading,
      divisionError: error,
      divisionValidating: isValidating,
      divisionEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDivisionDetails(divisionId: string) {
  const URL = divisionId ? epDoktek.division.details(divisionId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      division: data?.data as IDivision,
      divisionLoading: isLoading,
      divisionError: error,
      divisionValidating: isValidating,
      divisionEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchDivision(query: unknown) {
  const URL = query ? [epDoktek.division.search, { params: query }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    // keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: {
        division: (data?.division as IDivision[]) || [],
        count: (data?.count as number) || 0,
      },
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.division?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
