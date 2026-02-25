import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { ActivityLogsDetailsView } from 'src/sections/activity-logs/view';

// ----------------------------------------------------------------------

export default function ActivityLogsDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Activity Logs Details</title>
      </Helmet>

      <ActivityLogsDetailsView id={`${id}`} />
    </>
  );
}
