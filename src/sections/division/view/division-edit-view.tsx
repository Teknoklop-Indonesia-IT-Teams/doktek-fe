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
import { useGetDivision, useGetDivisionDetails } from 'src/api/division';
import DivisionDetailsToolbar from '../division-details-toolbar';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DivisionEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { division: currentDivision } = useGetDivisionDetails(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <DivisionDetailsToolbar backLink={paths.dashboard.division.root} />
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.general.file,
          },
          {
            name: 'Division',
            href: paths.dashboard.division.root,
          },
          { name: currentDivision?.division_name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DivisionNewEditForm currentDivision={currentDivision} />
    </Container>
  );
}
