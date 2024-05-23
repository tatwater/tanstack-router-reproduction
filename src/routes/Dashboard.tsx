import { createRoute } from '@tanstack/react-router'
import AuthenticatedRoute from '@/layouts/Authenticated'

const DashboardRoute = createRoute({
  getParentRoute: () => AuthenticatedRoute,
  path: '/dashboard',
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <h1>Dashboard</h1>
  )
}

export default DashboardRoute
