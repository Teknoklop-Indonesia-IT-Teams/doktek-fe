import { Helmet } from 'react-helmet-async';
// sections
import { DivisionCreateView } from 'src/sections/division/view';

// ----------------------------------------------------------------------

export default function DivisionCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new division</title>
      </Helmet>

      <DivisionCreateView />
    </>
  );
}
