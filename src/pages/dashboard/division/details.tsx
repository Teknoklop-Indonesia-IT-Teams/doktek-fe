import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { DivisionDetailsView } from 'src/sections/division/view';

// ----------------------------------------------------------------------

export default function DivisionDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Division Details</title>
      </Helmet>

      <DivisionDetailsView id={`${id}`} />
    </>
  );
}
