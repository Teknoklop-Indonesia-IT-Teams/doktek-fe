import { Helmet } from 'react-helmet-async';
// sections
import { DocumentsCreateView } from 'src/sections/technical-documents/view';

// ----------------------------------------------------------------------

export default function DocumentsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new document</title>
      </Helmet>

      <DocumentsCreateView />
    </>
  );
}
