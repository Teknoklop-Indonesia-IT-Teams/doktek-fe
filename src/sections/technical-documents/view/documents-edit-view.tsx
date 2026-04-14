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
  const lastActivity = currentDocument?.activities?.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Documents', href: paths.dashboard.technicalDocument.root },
          {
            name:
              lastActivity?.title ||
              currentDocument?.activities.map((activity) => activity.title).join(', '),
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DocumentsNewEditForm currentDocument={currentDocument} />
    </Container>
  );
}
