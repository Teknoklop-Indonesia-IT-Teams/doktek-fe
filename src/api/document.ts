import { useMemo } from 'react';
import useSWR from 'swr';
// utils
import { epDoktek, fetcherDoktek } from 'src/utils/axios-doktek';
// types
import type {
  IDocument,
  IDocumentActivity,
  IDocumentById,
  // IDocumentItem,
  // IDocumentItemsLog,
} from 'src/types/document';

// ----------------------------------------------------------------------

export function useGetDocuments() {
  const URL = epDoktek.document.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(() => {
    const transformed =
      data?.data?.flatMap((doc: any) =>
        doc.activities.map((act: any) => ({
          id_technical_document: doc.id_technical_document,
          id_technical_document_activity: act.id_technical_document_activity,

          title: act.title,
          document_number: act.document_number,
          version_number: act.version_number,

          created_at: act.created_at,
          updated_at: doc.updated_at,

          division: act.divisions,
          typeDocument: act.typeDocument,
        }))
      ) || [];

    return {
      document: transformed,
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !transformed.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useGetDocumentsActive() {
  const URL = epDoktek.document.listActive;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(() => {
    const transformed: IDocumentActivity[] =
      data?.data?.flatMap((doc: any) =>
        doc.activities.map((act: any) => ({
          id_technical_document: doc.id_technical_document,
          id_technical_document_activity: act.id_technical_document_activity,
          title: act.title,
          document_number: act.document_number,
          version_number: act.version_number,
          created_at: act.created_at,
          updated_at: doc.updated_at,
          division: act.divisions,
          typeDocument: act.typeDocument,
          document_file: act.document_file,
          created_by: act.user?.username || act.created_by,
          flag_active: act.flag_active,
        }))
      ) || [];

    return {
      documentActive: transformed,
      documentActiveLoading: transformed.length === 0 && isLoading,
      documentActiveError: error,
      documentActiveValidating: isValidating,
      documentActiveEmpty: !isLoading && !transformed.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useGetDocumentByID(documentId: string) {
  const URL = documentId ? epDoktek.document.details(documentId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(() => {
    const doc = data?.data;

    const transformed: IDocumentById | null = doc
      ? {
          id_technical_document: doc.id_technical_document,
          created_at: doc.created_at,
          created_by: doc.created_by,
          updated_at: doc.updated_at,
          activities:
            doc.activities?.map((act: any) => ({
              id_technical_document_activity: act.id_technical_document_activity,
              title: act.title,
              document_number: act.document_number,
              version_number: act.version_number,
              created_at: act.created_at,
              division: act.divisions,
              typeDocument: act.typeDocument,
              flag_active: act.flag_active,
              document_file: act.document_file,
              created_by: act.created_by || act.user?.username || doc.created_by,
            })) || [],
        }
      : null;

    return {
      document: transformed,
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !transformed,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export function useEditDocument(documentId: string) {
  const URL = documentId ? epDoktek.document.edit(documentId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
    revalidateOnFocus: false,
  });

  const memoizedValue = useMemo(() => {
    const transformed: IDocumentActivity[] =
      data?.data?.flatMap((doc: any) =>
        doc.activities.map((act: any) => ({
          id_technical_document: doc.id_technical_document,
          id_technical_document_activity: act.id_technical_document_activity,

          title: act.title,
          document_number: act.document_number,
          version_number: act.version_number,

          created_at: act.created_at,
          updated_at: doc.updated_at,

          division: act.divisions,
          typeDocument: act.typeDocument,
        }))
      ) || [];

    return {
      document: transformed,
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !transformed.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

// export function useGetDocumentItems() {
//   const URL = epDoktek.documentItem.list;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
//     revalidateOnFocus: false,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       documentItem: (data?.activities as IDocumentItem[]) || [],
//       documentItemLoading: isLoading,
//       documentItemError: error,
//       documentItemValidating: isValidating,
//       documentItemEmpty: !isLoading && !data?.activities?.length,
//     }),
//     [data?.activities, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// export function useGetDocumentItemsByID(documentItemId: string) {
//   const URL = documentItemId ? epDoktek.documentItem.details(documentItemId) : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
//     revalidateOnFocus: false,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       documentItem: data?.activities as IDocumentItem,
//       documentItemLoading: isLoading,
//       documentItemError: error,
//       documentItemValidating: isValidating,
//       documentItemEmpty: !isLoading && !data?.activities?.length,
//     }),
//     [data?.activities, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

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

// export function useGetDocumentItemsLog() {
//   const URL = epDoktek.documentItem.log;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcherDoktek, {
//     revalidateOnFocus: false,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       documentItemsLog: (data?.activities as IDocumentItemsLog[]) || [],
//       documentItemsLogLoading: isLoading,
//       documentItemsLogError: error,
//       documentItemsLogValidating: isValidating,
//       documentItemsLogEmpty: !isLoading && !data?.activities?.length,
//     }),
//     [data?.activities, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
