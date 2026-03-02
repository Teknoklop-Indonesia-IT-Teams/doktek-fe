import { useMemo } from 'react';
import useSWR from 'swr';
// utils
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';
// types
import type { ITypeManager } from 'src/types/type';

// ----------------------------------------------------------------------

export function useGetTypes() {
  const URL = epDoktek.type.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      type: (data?.data as ITypeManager[]) || [],
      typeLoading: isLoading,
      typeError: error,
      typeValidating: isValidating,
      typeEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetType(typeId: string) {
  const URL = typeId ? [epDoktek.type.details, { params: { typeId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      type: data?.data as ITypeManager,
      typeLoading: isLoading,
      typeError: error,
      typeValidating: isValidating,
      typeEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTypeDetails(typeId: string) {
  const URL = typeId ? epDoktek.type.details(typeId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      type: data?.data as ITypeManager,
      typeLoading: isLoading,
      typeError: error,
      typeValidating: isValidating,
      typeEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchType(query: unknown) {
  const URL = query ? [epDoktek.type.search, { params: query }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    // keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: {
        type: (data?.type as ITypeManager[]) || [],
        count: (data?.count as number) || 0,
      },
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.type?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
