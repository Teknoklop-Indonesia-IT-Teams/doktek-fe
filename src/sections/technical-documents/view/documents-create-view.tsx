// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DocumentsNewEditForm from '../documents-new-edit-form';

// ----------------------------------------------------------------------

export default function DocumentsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new all document"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'All Documents',
            href: paths.dashboard.technicalDocument.root,
          },
          {
            name: 'New techincal documents',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentsNewEditForm />
    </Container>
  );
}
