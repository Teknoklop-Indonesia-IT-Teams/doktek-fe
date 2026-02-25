import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { DivisionEditView } from 'src/sections/division/view';

// ----------------------------------------------------------------------

export default function DivisionEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Division Edit</title>
      </Helmet>

      <DivisionEditView id={`${id}`} />
    </>
  );
}
