import { createRoute, redirect } from '@tanstack/react-router';
import RootRoute from '@/layouts/Root';
import DashboardRoute from '@/routes/Dashboard';
import SignInRoute from '@/routes/SignIn';

const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: DashboardRoute.to,
      });
    } else {
      throw redirect({
        to: SignInRoute.to,
      });
    }
  }
});

export default IndexRoute;
