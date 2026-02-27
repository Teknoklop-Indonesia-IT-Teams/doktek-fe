import { Helmet } from 'react-helmet-async';
// sections
import { TypeDocumentView } from 'src/sections/type-document/view';

// ----------------------------------------------------------------------

export default function TypeDocumentListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Type Document List</title>
      </Helmet>

      <TypeDocumentView />
    </>
  );
}
