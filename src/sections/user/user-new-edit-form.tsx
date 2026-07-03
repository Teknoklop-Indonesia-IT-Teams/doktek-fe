import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
// utils
import { posterDoktek, epDoktek, patcherDoktek, putDoktek } from 'src/utils/axios-doktek';
// Api
import { useGetDivision } from 'src/api/division';
import { useGetRoles } from 'src/api/role';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// types
import { IUserItem } from 'src/types/user';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFSelect,
} from 'src/components/hook-form';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { division } = useGetDivision();
  const { roles } = useGetRoles();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().test('password-required', 'Password is required', function (value) {
      if (currentUser) {
        return true; // Not required on edit
      }
      return !!value; // Required on create
    }),
    id_division: Yup.number().required('Division is required'),
    id_role: Yup.number().required('Role is required'),
    flag_active: Yup.boolean().required(),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      password: '',
      id_division: currentUser?.division?.id_division || 0,
      id_role: currentUser?.role?.id_role || 0,
      flag_active: currentUser?.flag_active ?? true,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data };
      if (currentUser && !payload.password) {
        delete payload.password; // Don't send empty password on edit
      }

      if (currentUser) {
        await putDoktek(epDoktek.users.details(currentUser.id_user.toString()), payload);
      } else {
        await posterDoktek(epDoktek.users.new, payload);
      }
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Username" />
              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? (
                          <Iconify icon="fluent:eye-off-16-filled" width={28} />
                        ) : (
                          <Iconify icon="fluent:eye-16-filled" width={28} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Untuk division & role perlu useGetDivision dan useGetRoles */}
              <RHFSelect name="id_division" label="Division">
                {division.map((div) => (
                  <MenuItem key={div.id_division} value={div.id_division}>
                    {div.division_name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="id_role" label="Role">
                {roles
                  .filter((role) => role.role_name !== 'Super Admin')
                  .map((role) => (
                    <MenuItem key={role.id_role} value={role.id_role}>
                      {role.role_name}
                    </MenuItem>
                  ))}
              </RHFSelect>

              <RHFSwitch name="flag_active" label="Active" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
