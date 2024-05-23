import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import RootRoute from '@/layouts/Root';
// import DashboardRoute from '@/routes/Dashboard';

const UnAuthenticatedRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'unAuthenticated',
  beforeLoad: ({ context }) => {
    console.log('unauthenticated.isauthenticated', context.auth.isAuthenticated);

    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/dashboard',  // DashboardRoute.to
      });
    }
  },
  component: UnAuthenticatedLayout,
});

function UnAuthenticatedLayout() {
  return (
    <Outlet />
  );
}

export default UnAuthenticatedRoute;
