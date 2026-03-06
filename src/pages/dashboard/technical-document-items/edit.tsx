import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { DocumentItemsEditView } from 'src/sections/technical-documents/view';

// ----------------------------------------------------------------------

export default function DocumentItemsEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Document Items Edit</title>
      </Helmet>

      <DocumentItemsEditView id={`${id}`} />
    </>
  );
}
