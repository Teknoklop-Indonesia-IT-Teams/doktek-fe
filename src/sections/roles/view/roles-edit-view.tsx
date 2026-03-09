// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RolesNewEditForm from '../roles-new-edit-form';
import { useGetRoles, useGetRolesDetails } from 'src/api/role';
import { _role } from 'src/_mock/_role';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function RolesEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { roles: currentRole } = useGetRolesDetails(id);
  // const currentRoles = _role.find((role) => role.id_role.toString() === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
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
