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
import DivisionDetails from '../division-details';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DivisionDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const currentDivision = _invoices.filter((division) => division.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentDivision?.invoiceNumber}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Division',
            href: paths.dashboard.division.root,
          },
          { name: currentDivision?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DivisionDetails invoice={currentDivision} />
    </Container>
  );
}
