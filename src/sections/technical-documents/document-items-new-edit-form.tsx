import { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
// types
import { IDocumentItem, IDocumentItemsInput } from 'src/types/document';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { useGetDivision } from 'src/api/division';
import { epDoktek, patcherDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { mutate } from 'swr';
import { useGetType, useGetTypes } from 'src/api/type';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

type Props = {
  currentDocumentItems?: IDocumentItem;
  id_technical_documents?: string;
};

type FormValues = {
  id_technical_document: string;
  id_type_document: string;
  document_file: (File | string)[];
};

export default function DocumentItemsNewEditForm({
  currentDocumentItems,
  id_technical_documents,
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  const { type } = useGetTypes();

  const NewDocumentItemsSchema = Yup.object().shape({
    id_technical_document: Yup.string(),
    document_file: Yup.array().max(1, 'Only one file allowed').nullable().notRequired(),
    id_type_document: Yup.string().required('Type is required'),
  });

  const defaultValues: FormValues = useMemo(
    () => ({
      id_technical_document:
        currentDocumentItems?.technicalDocument.id_technical_document?.toString() || '',
      document_file: currentDocumentItems?.document_file || [],
      id_type_document: currentDocumentItems?.typeDocument.id_type_document?.toString() || '',
    }),
    [currentDocumentItems, type]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentItemsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentDocumentItems) {
      reset(defaultValues);
    }
  }, [currentDocumentItems, defaultValues, reset]);

  useEffect(() => {
    if (currentDocumentItems) {
      setValue(
        'id_technical_document',
        currentDocumentItems.technicalDocument.id_technical_document.toString()
      );
    }
  }, [currentDocumentItems, setValue]);
  useEffect(() => {
    if (id_technical_documents) {
      setValue('id_technical_document', id_technical_documents);
    }
  }, [id_technical_documents, setValue]);

  const postDocumentItems = (data: IDocumentItemsInput) => {
    const dataDocumentItems = data;
    if (currentDocumentItems) {
      const URLEdit = epDoktek.documentItem.edit(
        currentDocumentItems?.id_technical_document_item.toString()
      );
      putDoktek(URLEdit, dataDocumentItems, {})
        .then((response: any) => {
          enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');

          if (id_technical_documents) {
            router.push(paths.dashboard.technicalDocument.details(id_technical_documents));
          }
          console.info('DATA', response);
        })
        .catch((error: any) => {
          console.error(error);
          enqueueSnackbar(
            currentDocumentItems
              ? `Update failed! ${error.message}`
              : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    } else {
      const URL = epDoktek.documentItem.postDocumentItem;
      posterDoktek(URL, dataDocumentItems, {})
        .then((response) => {
          enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');
          if (id_technical_documents) {
            router.push(paths.dashboard.technicalDocument.details(id_technical_documents));
          }
          console.info('DATA', response);
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar(
            currentDocumentItems
              ? `Update failed! ${error.message}`
              : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('DATA', data);

    try {
      const formData = new FormData();

      // cek perubahan type document
      if (
        data.id_type_document &&
        data.id_type_document !== currentDocumentItems?.typeDocument?.id_type_document?.toString()
      ) {
        formData.append('id_type_document', data.id_type_document);
      }

      // cek perubahan file
      if (data.document_file && data.document_file.length > 0) {
        const file = data.document_file[0];

        // jika file baru (File object)
        if (file instanceof File) {
          formData.append('file', file);
        }
      }

      // jika create
      if (!currentDocumentItems) {
        formData.append('id_technical_document', id_technical_documents || '');
      }

      // jika edit
      if (currentDocumentItems) {
        await putDoktek(
          epDoktek.documentItem.edit(currentDocumentItems.id_technical_document_item.toString()),
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        await posterDoktek(epDoktek.documentItem.postDocumentItem, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');

      if (id_technical_documents) {
        mutate(epDoktek.document.details(id_technical_documents));
      }

      reset();
    } catch (error: any) {
      enqueueSnackbar(`Save failed! ${error.message}`, {
        variant: 'error',
      });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.document_file || [];

      const newFiles = acceptedFiles.map((file) => file);

      setValue('document_file', acceptedFiles, { shouldValidate: true });
    },
    [setValue, values.document_file]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.document_file && values.document_file?.filter((file) => file !== inputFile);
      setValue('document_file', filtered);
    },
    [setValue, values.document_file]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('document_file', []);
  }, [setValue]);

  const renderDetails = (
    <Grid xs={12}>
      <Card>
        <CardHeader title="Document Item" />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFSelect
            native
            name="id_type_document"
            label="Type Document"
            InputLabelProps={{ shrink: true }}
          >
            <option value="" />

            {type.map((item) => (
              <option key={item.id_type_document} value={item.id_type_document}>
                {item.code_document}
              </option>
            ))}
          </RHFSelect>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Upload File</Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Optional (max 1 file)
            </Typography>

            <RHFUpload
              name="document_file"
              // files={values.document_file}
              maxSize={3145728}
              multiple={false}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentDocumentItems ? 'Create Document Item' : 'Save Changes'}
      </LoadingButton>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
