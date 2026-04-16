// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TypeDocumentNewEditForm from '../type-document-new-edit-form';
//

// ----------------------------------------------------------------------

export default function TypeDcoumentsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Create a new type documents"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Type Dcouments',
            href: paths.dashboard.typeDocument.root,
          },
          {
            name: 'New Type Dcouments',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TypeDocumentNewEditForm />
    </Container>
  );
}
