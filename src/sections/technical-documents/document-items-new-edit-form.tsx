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
import { IDocument, IDocumentActivity, IDocumentById, IDocumentInput } from 'src/types/document';
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
  currentDocumentItems?: IDocumentActivity;
  id_technical_documents?: string;
};

type FormValues = {
  id_technical_document_activity: string;
  id_type_document: string;
  id_division: string;
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
    id_technical_document_activity: Yup.string(),
    document_file: Yup.array().max(1, 'Only one file allowed').nullable().notRequired(),
    id_type_document: Yup.string().required('Type is required'),
    id_division: Yup.string().required('Division is required'),
  });

  const defaultValues: FormValues = useMemo(
    () => ({
      id_technical_document_activity:
        currentDocumentItems?.id_technical_document_activity?.toString() || '',

      document_file: currentDocumentItems?.document_file
        ? [currentDocumentItems.document_file]
        : [],

      id_type_document: currentDocumentItems?.typeDocument?.id_type_document?.toString() || '',

      id_division: currentDocumentItems?.division?.id_division?.toString() || '',
    }),
    [currentDocumentItems]
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
    if (id_technical_documents) {
      setValue('id_technical_document_activity', id_technical_documents);
    }
  }, [id_technical_documents, setValue]);

  const postDocumentItems = (data: IDocumentInput) => {
    const dataDocumentItems = data;
    if (currentDocumentItems) {
      const URLEdit = epDoktek.documentItem.edit(
        currentDocumentItems?.id_technical_document_activity.toString()
      );
      putDoktek(URLEdit, dataDocumentItems, {})
        .then((response: any) => {
          enqueueSnackbar(currentDocumentItems ? 'Update success!' : 'Create success!');

          if (id_technical_documents) {
            router.push(paths.dashboard.technicalDocument.details(id_technical_documents));
          }
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
    try {
      const formData = new FormData();

      // 🔥 bikin object activity
      const activities = [
        {
          id_division: Number(data.id_division),
          id_type_document: Number(data.id_type_document),
          title: currentDocumentItems?.title || '', // atau input kalau ada
        },
      ];

      // 🔥 WAJIB stringify
      formData.append('activities', JSON.stringify(activities));

      // 🔥 file (optional)
      if (data.document_file && data.document_file.length > 0) {
        const file = data.document_file[0];
        if (file instanceof File) {
          formData.append('file', file);
        }
      }

      // 🔥 EDIT
      if (currentDocumentItems) {
        await putDoktek(
          epDoktek.document.edit(currentDocumentItems.id_technical_document.toString()),
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        // 🔥 CREATE
        await posterDoktek(epDoktek.document.postDocument, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      enqueueSnackbar('Success!');
    } catch (error: any) {
      enqueueSnackbar(`Failed! ${error.message}`, { variant: 'error' });
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
        {/* <CardHeader title="Document Item" /> */}

        <Stack spacing={3} sx={{ p: 3 }}>
          {/* <RHFSelect
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
          </RHFSelect> */}

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
