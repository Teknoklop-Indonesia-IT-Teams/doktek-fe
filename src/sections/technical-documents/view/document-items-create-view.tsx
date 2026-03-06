// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DocumentItemsNewEditForm from '../document-items-new-edit-form';

// ----------------------------------------------------------------------

export default function DocumentItemsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new all document item"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'All Document Items',
            href: paths.dashboard.techincalDocument.root,
          },
          {
            name: 'New techincal document item',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentItemsNewEditForm />
    </Container>
  );
}
