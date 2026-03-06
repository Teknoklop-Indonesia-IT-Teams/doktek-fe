import { Helmet } from 'react-helmet-async';
// sections
import { DocumentItemsCreateView } from 'src/sections/technical-documents/view';

// ----------------------------------------------------------------------

export default function DocumentItemsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new document item</title>
      </Helmet>

      <DocumentItemsCreateView />
    </>
  );
}
