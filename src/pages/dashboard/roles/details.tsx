import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { RolesDetailsView } from 'src/sections/roles/view';

// ----------------------------------------------------------------------

export default function RolesDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Roles Details</title>
      </Helmet>

      <RolesDetailsView id={`${id}`} />
    </>
  );
}
