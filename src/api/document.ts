import { useMemo } from 'react';
import useSWR from 'swr';
// utils
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';
// types
import type { IDocument, IDocumentItem } from 'src/types/document';

// ----------------------------------------------------------------------

export function useGetDocuments() {
  const URL = epDoktek.document.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      document: (data?.data as IDocument[]) || [],
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDocumentByID(documentId: string) {
  const URL = documentId ? epDoktek.document.details(documentId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      document: data?.data as IDocument,
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useEditDocument(documentId: string) {
  const URL = documentId ? epDoktek.document.edit(documentId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      document: data?.data as IDocument,
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !data?.data,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDocumentItems() {
  const URL = epDoktek.documentItem.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      documentItem: (data?.data as IDocumentItem[]) || [],
      documentItemLoading: isLoading,
      documentItemError: error,
      documentItemValidating: isValidating,
      documentItemEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDocumentItemsByID(documentItemId: string) {
  const URL = documentItemId ? epDoktek.documentItem.details(documentItemId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(
    () => ({
      documentItem: data?.data as IDocumentItem,
      documentItemLoading: isLoading,
      documentItemError: error,
      documentItemValidating: isValidating,
      documentItemEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchDocuments(query: unknown) {
  const URL = query ? [epDoktek.document.search, { params: query }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    // keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: {
        document: (data?.document as IDocument[]) || [],
        count: (data?.count as number) || 0,
      },
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.document?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
