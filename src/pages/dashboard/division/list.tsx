import { Helmet } from 'react-helmet-async';
// sections
import { DivisionListView } from 'src/sections/division/view';

// ----------------------------------------------------------------------

export default function DivisionListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Division List</title>
      </Helmet>

      <DivisionListView />
    </>
  );
}
