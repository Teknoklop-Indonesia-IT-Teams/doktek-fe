import { useMemo } from 'react';
import useSWR from 'swr';
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';

export function useGetUsers() {
    const URL = epDoktek.users.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
        revalidateOnFocus: false,
    });

    const memoizedValue = useMemo(
        () => ({
            users: (data?.data as any[]) || [],
            usersLoading: isLoading,
            usersError: error,
            usersValidating: isValidating,
            usersEmpty: !isLoading && !data?.data?.length,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}