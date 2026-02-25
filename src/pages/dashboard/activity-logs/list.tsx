import { Helmet } from 'react-helmet-async';
// sections
import { ActivityLogsListView } from 'src/sections/activity-logs/view';

// ----------------------------------------------------------------------

export default function ActivityLogsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Activity Logs List</title>
      </Helmet>

      <ActivityLogsListView />
    </>
  );
}
