import { Helmet } from 'react-helmet-async';
import { TypeDocumentCreateView } from 'src/sections/type-document/view';
// sections

// ----------------------------------------------------------------------

export default function TypeDocumentsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new type document</title>
      </Helmet>

      <TypeDocumentCreateView />
    </>
  );
}
