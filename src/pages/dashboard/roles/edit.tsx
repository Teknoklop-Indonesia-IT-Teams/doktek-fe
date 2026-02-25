import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RolesEditView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export default function RolesEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Roles Edit</title>
      </Helmet>

      <RolesEditView id={`${id}`} />
    </>
  );
}
