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
import DocumentDetails from '../documents-details';
import { useGetDocumentByID } from 'src/api/document';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import DocumentDetailsToolbar from '../documents-details-toolbar';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DocumentsDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const { document: currentDocument } = useGetDocumentByID(id);
  const currentDocuments = _invoices.filter((documents) => documents.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <DocumentDetailsToolbar backLink={paths.dashboard.techincalDocument.root} />
      <CustomBreadcrumbs
        heading={currentDocument?.document_number}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Documents',
            href: paths.dashboard.techincalDocument.root,
          },
          { name: currentDocument?.document_number },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.techincalDocument.item.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Document Item
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DocumentDetails documents={currentDocument} />
    </Container>
  );
}
