import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { TypeDocumentDetailsView } from 'src/sections/type-document/view';

// ----------------------------------------------------------------------

export default function TypeDocumentDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Type Document Details</title>
      </Helmet>

      <TypeDocumentDetailsView id={`${id}`} />
    </>
  );
}
