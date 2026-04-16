// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RolesNewEditForm from '../roles-new-edit-form';
import { useGetRolesDetails } from 'src/api/role';
import { _role } from 'src/_mock/_role';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function RolesEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { roles: currentRole } = useGetRolesDetails(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.general.file,
          },
          {
            name: 'Roles',
            href: paths.dashboard.roles.root,
          },
          { name: currentRole?.role_name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RolesNewEditForm currentRoles={currentRole} />
    </Container>
  );
}
