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
import DocumentsNewEditForm from '../documents-new-edit-form';
import { useGetDocumentByID } from 'src/api/document';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DocumentsEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { document: currentDocument } = useGetDocumentByID(id);
  // const currentDocuments = _invoices.find((invoice) => invoice.id === id);

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
            name: 'Documents',
            href: paths.dashboard.technicalDocument.root,
          },
          { name: currentDocument?.document_number },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentsNewEditForm currentDocument={currentDocument} />
    </Container>
  );
}
