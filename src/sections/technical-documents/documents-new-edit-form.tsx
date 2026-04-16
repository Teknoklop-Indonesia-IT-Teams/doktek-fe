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
import { useRouter } from 'src/routes/hooks';
// types
import { IDocument, IDocumentActivity, IDocumentById, IDocumentInput } from 'src/types/document';
// components
import FormProvider, { RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { useGetDivision } from 'src/api/division';
import { epDoktek, patcherDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { mutate } from 'swr';
import { useGetTypes } from 'src/api/type';

// ----------------------------------------------------------------------

type Props = {
  currentDocument?: IDocumentById | null;
};

export default function DocumentNewEditForm({ currentDocument }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  const { division } = useGetDivision();
  const { type } = useGetTypes();

  const NewDocumentSchema = Yup.object().shape({
    title: Yup.string().required('Job Title is required'),
    id_division: Yup.string().required('Division is required'),
    id_type_document: Yup.string().required('Type Document is required'),
    document_file: Yup.array().max(1, 'Only one file allowed').nullable().notRequired(),
  });

  const lastActivity = currentDocument?.activities
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const defaultValues = useMemo(
    () => ({
      title: lastActivity?.title || '',
      id_division: lastActivity?.division.id_division.toString() || '',
      id_type_document: lastActivity?.typeDocument.id_type_document.toString() || '',
      document_file: lastActivity?.document_file ? [lastActivity.document_file] : [],
    }),
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentSchema),
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
    if (currentDocument) {
      reset(defaultValues);
    }
  }, [currentDocument, defaultValues, reset]);

  const postDocument = (data: IDocumentInput) => {
    const dataDocument = data;
    if (currentDocument) {
      const URLEdit = epDoktek.document.edit(currentDocument?.id_technical_document.toString());
      putDoktek(URLEdit, dataDocument, {})
        .then((response: any) => {
          enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.technicalDocument.root);
        })
        .catch((error: any) => {
          console.error(error);
          enqueueSnackbar(
            currentDocument ? `Update failed! ${error.message}` : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    } else {
      const URL = epDoktek.document.postDocument;
      posterDoktek(URL, dataDocument, {})
        .then((response) => {
          enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.technicalDocument.root);
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar(
            currentDocument ? `Update failed! ${error.message}` : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    }
  };

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      const activities = [
        {
          id_division: Number(data.id_division),
          id_type_document: Number(data.id_type_document),
          title: data.title,
        },
      ];

      formData.append('activities', JSON.stringify(activities));

      // 🔥 ambil file pertama
      const file = data.document_file?.[0];

      if (file instanceof File) {
        // ✅ user upload file baru
        formData.append('file', file);
      } else if (typeof file === 'string') {
        // ✅ file lama → kirim ke backend biar tidak hilang
        formData.append('existing_file', file);
      }

      if (currentDocument) {
        await putDoktek(
          epDoktek.document.edit(currentDocument.id_technical_document.toString()),
          formData
        );
      } else {
        await posterDoktek(epDoktek.document.postDocument, formData);
      }

      enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.technicalDocument.root);
    } catch (error: any) {
      enqueueSnackbar(`Failed! ${error.message}`, { variant: 'error' });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Job Title" />

            <RHFSelect
              native
              name="id_division"
              label="Division"
              InputLabelProps={{ shrink: true }}
            >
              {division.map((category) => (
                <option key={category.id_division} value={category.id_division}>
                  {category.division_name}
                </option>
              ))}
            </RHFSelect>

            <RHFSelect
              native
              name="id_type_document"
              label="Type Document"
              InputLabelProps={{ shrink: true }}
            >
              {type.map((category) => (
                <option key={category.id_type_document} value={category.id_type_document}>
                  {category.type_document}
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
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentDocument ? 'Create Document' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
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
