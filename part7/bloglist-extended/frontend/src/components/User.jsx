import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'
import { Card, ListGroup } from 'react-bootstrap'

const User = () => {
  const { id } = useParams()

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading user</div>
  }

  const user = users.find((u) => u.id === id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <Card>
        <Card.Header as='h3'>{user.name}</Card.Header>
        <Card.Body>
          <Card.Title as='h5'>Added blogs</Card.Title>
          {user.blogs.length === 0 ? (
            <p className='text-muted'>No blogs added yet</p>
          ) : (
            <ListGroup as="ol" numbered variant='flush'>
              {user.blogs.map((blog) => (
                <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default User
