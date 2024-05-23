import { createRoute, Outlet, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import RootRoute from '@/layouts/Root'
// import SignInRoute from '@/routes/SignIn'
import { useAuth } from '@/lib/auth'

const AuthenticatedRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'authenticated',
  beforeLoad: ({ context, location }) => {
    console.log('authenticated.isauthenticated', context.auth.isAuthenticated)

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/signin',  // SignInRoute.to
        search: {
          redirect: location.href,
        }
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const navigate = useNavigate()
  const router = useRouter()
  const { signOut, user } = useAuth()

  const handleSignOut = () => {
    const signOutRedirect = () => {
      router.invalidate();
      navigate({
        to: '/signin',  // SignInRoute.to
        replace: true,
      })
    }

    signOut(signOutRedirect)
  }

  if (!user) {
    return (
      <>Loading user...</>
    )
  }

  return (
    <div>
      <div>
        <p>{`Hi, ${user.givenName}`}</p>
        <button onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      <Outlet />
    </div>
  )
}

export default AuthenticatedRoute
