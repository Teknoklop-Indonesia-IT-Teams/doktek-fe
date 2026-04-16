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
import { IInvoice } from 'src/types/invoice';
// _mock
import { _addressBooks } from 'src/_mock';
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFEditor,
  RHFMultiCheckbox,
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload,
} from 'src/components/hook-form';
// types
import { IDivision, IDivisionInput } from 'src/types/division';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSnackbar } from 'src/components/snackbar';
import {
  Box,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  Typography,
} from '@mui/material';
import { epDoktek, posterDoktek, putDoktek } from 'src/utils/axios-doktek';
import { mutate } from 'swr';

// ----------------------------------------------------------------------

type Props = {
  currentDivision?: IDivision;
};

export default function DivisionNewEditForm({ currentDivision }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewDivisionSchema = Yup.object().shape({
    division_name: Yup.string().required('Division Name is required'),
    division_code: Yup.string().required('Division Code is required'),
  });

  const defaultValues = useMemo(
    () => ({
      division_name: currentDivision?.division_name || '',
      division_code: currentDivision?.division_code || '',
    }),
    [currentDivision]
  );

  const methods = useForm({
    resolver: yupResolver(NewDivisionSchema),
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
    if (currentDivision) {
      reset(defaultValues);
    }
  }, [currentDivision, defaultValues, reset]);

  const postDivision = (data: IDivisionInput) => {
    const dataDivision = data;
    if (currentDivision) {
      const URLEdit = epDoktek.division.edit(currentDivision?.id_division);
      putDoktek(URLEdit, dataDivision, {})
        .then((response: any) => {
          enqueueSnackbar(currentDivision ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.division.root);
          console.info('DATA', response);
        })
        .catch((error: any) => {
          console.error(error);
          enqueueSnackbar(
            currentDivision ? `Update failed! ${error.message}` : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    } else {
      const URL = epDoktek.division.postDivision;
      posterDoktek(URL, dataDivision, {})
        .then((response) => {
          enqueueSnackbar(currentDivision ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.division.root);
          console.info('DATA', response);
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar(
            currentDivision ? `Update failed! ${error.message}` : `Create failed! ${error.message}`,
            {
              variant: 'error',
            }
          );
        });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload: IDivisionInput = {
      ...data,
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      postDivision(payload);
      mutate(epDoktek.division.search);
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Stack spacing={1} sx={{ mb: 3, ml: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Fill in the details of the division.
            </Typography>
          </Stack>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="division_name" label="Division Name" multiline rows={4} />

            <RHFTextField name="division_code" label="Division Code" />
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
          {!currentDivision ? 'Create Division' : 'Save Changes'}
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
