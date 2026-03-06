import { useEffect, useMemo } from 'react';
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
import { IDocument, IDocumentInput } from 'src/types/document';
// components
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { useGetDivision } from 'src/api/division';
import { epDoktek, patcherDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

type Props = {
  currentDocument?: IDocument;
};

export default function DocumentNewEditForm({ currentDocument }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  const { division } = useGetDivision();

  const NewDocumentSchema = Yup.object().shape({
    job_title: Yup.string().required('Job Title is required'),
    id_division: Yup.string().required('Division is required'),
  });

  const defaultValues = useMemo(
    () => ({
      job_title: currentDocument?.job_title || '',
      id_division: currentDocument?.division.id_division || '',
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
          router.push(paths.dashboard.techincalDocument.root);
          console.info('DATA', response);
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
          router.push(paths.dashboard.techincalDocument.root);
          console.info('DATA', response);
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

  const onSubmit = handleSubmit(async (data) => {
    const payload: IDocumentInput = {
      ...data,
      id_division: Number(data.id_division),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      postDocument(payload);
      mutate(epDoktek.document.search);
      reset();
    } catch (error) {
      console.error(error);
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
            <RHFTextField name="job_title" label="Job Title" />

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
