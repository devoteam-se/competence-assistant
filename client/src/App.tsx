import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';

import { useAuth } from '@/contexts/auth';
import AppShell from '@/components/AppShell';

// Code split the application per route.
const PageLogin = lazy(() => import('./pages/login'));
const PageWishes = lazy(() => import('./pages/wishes'));
const PageEvent = lazy(() => import('./pages/event'));
const PageEventSessions = lazy(() => import('./pages/event/PageEventSessions'));
const PageEventSchedule = lazy(() => import('./pages/event/PageEventSchedule'));
const PageAdmin = lazy(() => import('./pages/admin'));
const PageAdminSchedule = lazy(() => import('./pages/admin/schedule'));
const PageAdminEvents = lazy(() => import('./pages/admin/events'));
const PageAdminTracks = lazy(() => import('./pages/admin/tracks'));
const PageAdminPermissions = lazy(() => import('./pages/admin/permissions'));
const PageSessions = lazy(() => import('./pages/sessions'));
const PageAdminLocations = lazy(() => import('./pages/admin/locations'));

type ProtectedRouteProps = {
  children: JSX.Element;
  isAllowed: boolean;
  redirectPath: string;
};

const ProtectedRoute = ({ children, isAllowed, redirectPath: path }: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate replace to={path} />;
  }
  return children;
};

const App = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="login"
          element={
            <Suspense>
              <PageLogin />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAllowed={!!currentUser} redirectPath="/login">
              <AppShell>
                <Suspense>
                  <Outlet />
                </Suspense>
              </AppShell>
            </ProtectedRoute>
          }
        >
          <Route index element={<PageSessions />} />
          <Route path="wishes" element={<PageWishes />} />
          <Route path="events/:eventId" element={<PageEvent />}>
            <Route path="sessions" element={<PageEventSessions />} />
            <Route path="schedule" element={<PageEventSchedule />} />
          </Route>

          {currentUser?.admin && (
            <Route path="admin" element={<PageAdmin />}>
              <Route index element={<Navigate replace to="/admin/events" />} />
              <Route path="events" element={<PageAdminEvents />} />
              <Route path="tracks" element={<PageAdminTracks />} />
              <Route path="permissions" element={<PageAdminPermissions />} />
              <Route path="locations" element={<PageAdminLocations />} />
              <Route path="schedules/:eventId" element={<PageAdminSchedule />} />
            </Route>
          )}
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
