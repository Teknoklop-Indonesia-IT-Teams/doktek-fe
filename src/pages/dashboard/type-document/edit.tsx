import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { TypeDocumentEditView } from 'src/sections/type-document/view';

// ----------------------------------------------------------------------

export default function TypeDocumentEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Type Document Edit</title>
      </Helmet>

      <TypeDocumentEditView id={`${id}`} />
    </>
  );
}
