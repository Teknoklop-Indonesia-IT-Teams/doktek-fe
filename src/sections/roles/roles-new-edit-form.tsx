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
import { IRole, IRoleInput } from 'src/types/role';
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
  currentRoles?: IRole;
};

export default function RolesNewEditForm({ currentRoles }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewRolesSchema = Yup.object().shape({
    role_name: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      role_name: currentRoles?.role_name || '',
    }),
    [currentRoles]
  );

  const methods = useForm({
    resolver: yupResolver(NewRolesSchema),
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
    if (currentRoles) {
      reset(defaultValues);
    }
  }, [currentRoles, defaultValues, reset]);

  const postRole = (data: IRoleInput) => {
    const dataRole = data;
    if (currentRoles) {
      const URLEdit = epDoktek.roles.edit(currentRoles?.id_role);
      putDoktek(URLEdit, dataRole, {})
        .then((response: any) => {
          enqueueSnackbar(currentRoles ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.roles.root);
          console.info('DATA', response);
        })
        .catch((error: any) => {
          console.error(error);
          const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
          enqueueSnackbar(currentRoles ? `Update failed! ${msg}` : `Create failed! ${msg}`, {
            variant: 'error',
          });
        });
    } else {
      const URL = epDoktek.roles.postRole;
      posterDoktek(URL, dataRole, {})
        .then((response) => {
          enqueueSnackbar(currentRoles ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.roles.root);
          console.info('DATA', response);
        })
        .catch((error) => {
          console.error(error);
          const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
          enqueueSnackbar(currentRoles ? `Update failed! ${msg}` : `Create failed! ${msg}`, {
            variant: 'error',
          });
        });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload: IRoleInput = {
      ...data,
    };
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      postRole(payload);
      mutate(epDoktek.roles.search);
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
              Create or edit your roles and necessary information from here.
            </Typography>
          </Stack>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="role_name" label="Roles Name" />
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
          {!currentRoles ? 'Create Roles' : 'Save Changes'}
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
