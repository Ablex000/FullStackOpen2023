import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import userService from '../services/users'
import { Table } from 'react-bootstrap'

const Users = () => {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (isLoading) {
    return <div>Loading users...</div>
  }

  if (isError) {
    return <div>Error loading users</div>
  }

  return (
    <div>
      <h3>Users</h3>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
