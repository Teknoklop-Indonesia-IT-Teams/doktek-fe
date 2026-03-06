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
import { useGetDocumentByID, useGetDocumentItemsByID } from 'src/api/document';
import { useParams } from 'react-router';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DocumentItemsEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { id_technical_document } = useParams();

  const { documentItem: currentDocumentItem } = useGetDocumentItemsByID(id);
  // const currentDocumentItems = _invoices.find((invoice) => invoice.id === id);

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
            href: paths.dashboard.techincalDocument.root,
          },
          { name: currentDocumentItem?.document_number },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentItemsNewEditForm
        currentDocumentItems={currentDocumentItem}
        id_technical_documents={id_technical_document}
      />
    </Container>
  );
}
