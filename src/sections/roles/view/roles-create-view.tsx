// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RolesNewEditForm from '../roles-new-edit-form';
import RolesDetailsToolbar from '../roles-details-toolbar';

// ----------------------------------------------------------------------

export default function RolesCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RolesDetailsToolbar backLink={paths.dashboard.roles.root} />
      <CustomBreadcrumbs
        heading="Create a new roles"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.general.file,
          },
          {
            name: 'Roles',
            href: paths.dashboard.roles.root,
          },
          {
            name: 'New Roles',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RolesNewEditForm />
    </Container>
  );
}
