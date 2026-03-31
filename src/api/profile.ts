import { useMemo } from 'react';
import type { AuthUserType } from 'src/auth/types';
import type { Profile } from 'src/types/schema';
import type { IUserProfile } from 'src/types/user';
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';
import useSWR from 'swr';

export function useGetProfile(profileId: string) {
  const URL = profileId ? epDoktek.users.details(profileId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek);

  const memoizedValue = useMemo(
    () => ({
      profile: data as Profile,
      profileLoading: isLoading,
      productError: error,
      profileValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetProfiles(query: unknown) {
  const URL = query ? [epDoktek.users.search, { params: query }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });
  console.log(URL);

  const memoizedValue = useMemo(
    () => ({
      searchResults: {
        profile: (data?.profile as Partial<Profile>[]) || [],
        count: (data?.count as number) || 0,
      },
      profileLoading: isLoading,
      profileError: error,
      profileValidating: isValidating,
      profileEmpty: !isLoading && !data?.profile?.length,
    }),
    [data?.count, data?.profile, error, isLoading, isValidating]
  );

  return memoizedValue;
}
