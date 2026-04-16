// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DivisionNewEditForm from '../division-new-edit-form';
import DivisionDetailsToolbar from '../division-details-toolbar';

// ----------------------------------------------------------------------

export default function DivisionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <DivisionDetailsToolbar backLink={paths.dashboard.division.root} />
      <CustomBreadcrumbs
        heading="Create a new division"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.general.file,
          },
          {
            name: 'Division',
            href: paths.dashboard.division.root,
          },
          {
            name: 'New Division',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DivisionNewEditForm />
    </Container>
  );
}
