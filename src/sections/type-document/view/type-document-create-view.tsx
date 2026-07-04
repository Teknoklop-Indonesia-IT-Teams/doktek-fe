// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TypeDocumentNewEditForm from '../type-document-new-edit-form';
import TypeDocumentDetailsToolbar from '../type-document-details-toolbar';
//

// ----------------------------------------------------------------------

export default function TypeDcoumentsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <TypeDocumentDetailsToolbar backLink={paths.dashboard.typeDocument.root} />
      <CustomBreadcrumbs
        heading="Create a new type documents"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.general.file,
          },
          {
            name: 'Type Documents',
            href: paths.dashboard.typeDocument.root,
          },
          {
            name: 'New Type Documents',
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
