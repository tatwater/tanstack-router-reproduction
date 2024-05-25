import type { QueryClient } from '@tanstack/react-query';
import type { AuthContextValue } from '@/lib/auth';

import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import NotFound from '@/routes/NotFound';
import { useAuth } from '@/lib/auth';

type RootContext = {
  auth: AuthContextValue;
  queryClient: QueryClient;
}

const RootRoute = createRootRouteWithContext<RootContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <>Loading...</>
    );
  }

  return (
    <Outlet />
  );
}

export default RootRoute;
