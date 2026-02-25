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
import RolesDetails from '../activity-logs-details';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function RolesDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const currentRoles = _invoices.filter((roles) => roles.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentRoles?.invoiceNumber}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Roles',
            href: paths.dashboard.roles.root,
          },
          { name: currentRoles?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RolesDetails invoice={currentRoles} />
    </Container>
  );
}
