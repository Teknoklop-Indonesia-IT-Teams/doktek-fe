import { Helmet } from 'react-helmet-async';
// sections
import { RolesCreateView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export default function RolesCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new roles</title>
      </Helmet>

      <RolesCreateView />
    </>
  );
}
