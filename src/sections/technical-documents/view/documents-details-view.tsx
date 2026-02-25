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

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DocumentDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const currentDocuments = _invoices.filter((roles) => roles.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentDocuments?.invoiceNumber}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Documents',
            href: paths.dashboard.techincalDocument.root,
          },
          { name: currentDocuments?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DocumentDetails invoice={currentDocuments} />
    </Container>
  );
}
