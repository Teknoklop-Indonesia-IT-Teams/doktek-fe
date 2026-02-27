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
import TypeDocumentDetails from '../type-document-details';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TypeDocumentDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const currentTypeDocument = _invoices.filter((roles) => roles.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentTypeDocument?.invoiceNumber}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Type Document',
            href: paths.dashboard.roles.root,
          },
          { name: currentTypeDocument?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TypeDocumentDetails invoice={currentTypeDocument} />
    </Container>
  );
}
