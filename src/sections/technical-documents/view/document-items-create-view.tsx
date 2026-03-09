// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DocumentItemsNewEditForm from '../document-items-new-edit-form';
import { useLocation } from 'react-router';
import { useGetDocumentByID } from 'src/api/document';

// ----------------------------------------------------------------------

export default function DocumentItemsCreateView() {
  const settings = useSettingsContext();
  const location = useLocation();
  const idTechnicalDocument = location.state?.id_technical_document;
  const { document: currentDocument } = useGetDocumentByID(idTechnicalDocument);

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
            href: paths.dashboard.technicalDocument.root,
          },
          {
            name: 'New techincal document item',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentItemsNewEditForm
        id_technical_documents={currentDocument.id_technical_document.toString()}
      />
    </Container>
  );
}
