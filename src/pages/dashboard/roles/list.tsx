import { Helmet } from 'react-helmet-async';
// sections
import { RolesListView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export default function RolesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Roles List</title>
      </Helmet>

      <RolesListView />
    </>
  );
}
