import { Suspense } from 'react';
import ActivityLogs from './activity';
import Loading from './loading';

export default function LogsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ActivityLogs />
    </Suspense>
  );
}