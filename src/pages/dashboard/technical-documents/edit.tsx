import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { DocumentsEditView } from 'src/sections/technical-documents/view';

// ----------------------------------------------------------------------

export default function DocumentsEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Documents Edit</title>
      </Helmet>

      <DocumentsEditView id={`${id}`} />
    </>
  );
}
