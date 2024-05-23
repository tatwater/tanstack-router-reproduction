import RootRoute from '@/layouts/Root';
import AuthenticatedRoute from '@/layouts/Authenticated';
import UnAuthenticatedRoute from '@/layouts/UnAuthenticated';
import IndexRoute from '@/routes/Index';
import SignInRoute from '@/routes/SignIn';
import DashboardRoute from '@/routes/Dashboard';

const routeTree = RootRoute.addChildren([
  IndexRoute,
  UnAuthenticatedRoute.addChildren([
    SignInRoute,
  ]),
  AuthenticatedRoute.addChildren([
    DashboardRoute,
  ]),
]);

export default routeTree;
