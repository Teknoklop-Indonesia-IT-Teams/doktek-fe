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
import DocumentItemsNewEditForm from '../document-items-new-edit-form';
import { useGetDocumentByID } from 'src/api/document';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DocumentItemsEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { document: currentDocumentItem } = useGetDocumentByID(id);
  const activity = currentDocumentItem?.activities.find(
    (item) => item.id_technical_document_activity.toString() === id
  );

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
            name: 'Document Items',
            href: paths.dashboard.technicalDocument.root,
          },
          {
            name: currentDocumentItem?.activities
              .map((activity) => activity.document_number)
              .join(', '),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentItemsNewEditForm
        currentDocumentItems={activity}
        id_technical_documents={currentDocumentItem?.id_technical_document.toString()}
      />
    </Container>
  );
}
