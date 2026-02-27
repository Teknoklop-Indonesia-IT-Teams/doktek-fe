import { useMemo } from 'react';
import useSWR from 'swr';
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';

// ----------------------------------------------------------------------

export type IDivision = {
    id_division: number;
    division_name: string;
};

// ----------------------------------------------------------------------

export function useGetDivisions() {
    const URL = epDoktek.divisions.list;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
        revalidateOnFocus: false,
    });

    const memoizedValue = useMemo(
        () => ({
            divisions: (data?.data as IDivision[]) || [],
            divisionsLoading: isLoading,
            divisionsError: error,
            divisionsValidating: isValidating,
            divisionsEmpty: !isLoading && !data?.data?.length,
        }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDivisionDetails(divisionId: number) {
    const URL = divisionId ? epDoktek.divisions.details(divisionId) : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
        revalidateOnFocus: false,
    });

    const memoizedValue = useMemo(
        () => ({
            division: data?.data as IDivision,
            divisionLoading: isLoading,
            divisionError: error,
            divisionValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}