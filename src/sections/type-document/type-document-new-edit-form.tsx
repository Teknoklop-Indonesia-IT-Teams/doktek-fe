import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// types
import { ITypeManager } from 'src/types/type';
// _mock
import { _addressBooks } from 'src/_mock';
// types
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import { CardHeader, Grid, Typography } from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentTypes?: ITypeManager;
};

export default function TypeDocumentNewEditForm({ currentTypes }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTypesSchema = Yup.object().shape({
    type_document: Yup.string().required('Type Document is required'),
    code_document: Yup.string().required('Code Document is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentTypes?.id || '',
      type_document: currentTypes?.type_document || '',
      code_document: currentTypes?.code_document || '',
    }),
    [currentTypes]
  );

  const methods = useForm({
    resolver: yupResolver(NewTypesSchema),
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
    if (currentTypes) {
      reset(defaultValues);
    }
  }, [currentTypes, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentTypes ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.typeDocument.root);
      console.info('DATA', data);
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
            Type Document, Code Document
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="type_document" label="Type Document Name" multiline rows={4} />

            <RHFTextField name="code_document" label="Code Document Name" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentTypes ? 'Create Type Document' : 'Save Changes'}
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
