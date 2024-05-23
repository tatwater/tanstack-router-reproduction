import { Link } from '@tanstack/react-router'

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <Link to='/signin'>Sign In</Link>
    </div>
  )
}

export default NotFound
