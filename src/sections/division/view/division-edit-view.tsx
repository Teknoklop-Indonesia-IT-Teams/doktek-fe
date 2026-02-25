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
import DivisionNewEditForm from '../division-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DivisionEditView({ id }: Props) {
  const settings = useSettingsContext();

  const currentDivision = _invoices.find((invoice) => invoice.id === id);

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
            name: 'Division',
            href: paths.dashboard.invoice.root,
          },
          { name: currentDivision?.invoiceNumber },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DivisionNewEditForm currentInvoice={currentDivision} />
    </Container>
  );
}
