import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogView from './components/BlogView'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useNotificationDispatch, setNotification } from './contexts/NotificationContext'
import { useUserValue, useUserDispatch } from './contexts/UserContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route, Link } from 'react-router-dom'
import { Table, Navbar, Nav, Button, Form } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const blogFormRef = useRef()
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    select: (data) => data.sort((a, b) => b.likes - a.likes),
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setNotification(
        notificationDispatch,
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      )
      blogFormRef.current.toggleVisibility()
    },
    onError: (error) => {
      setNotification(
        notificationDispatch,
        'Failed to create blog - ' + error.response.data.error,
        'error'
      )
    },
  })

  const updateLikesMutation = useMutation({
    mutationFn: ({ id, likes }) => blogService.updateLikes(id, likes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      console.error('Error updating likes:', error)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setNotification(notificationDispatch, 'Blog deleted successfully', 'success')
    },
    onError: (error) => {
      console.error('Error deleting blog:', error)
    },
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      setUsername('')
      setPassword('')
      setNotification(notificationDispatch, `Welcome ${user.name}`, 'success')
    } catch (exception) {
      setNotification(notificationDispatch, 'Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    userDispatch({ type: 'CLEAR_USER' })
    blogService.setToken(null)
    setNotification(notificationDispatch, 'Logged out successfully', 'success')
  }

  const loginForm = () => (
    <div>
      <h2>Log in to Application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className='mb-3'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            data-testid='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
            placeholder='Enter username'
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            data-testid='password'
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
            placeholder='Enter password'
          />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Login
        </Button>
      </Form>
    </div>
  )

  const addBlog = (blogObject) => {
    createBlogMutation.mutate(blogObject)
  }

  const updateBlogLikes = (id, likes) => {
    updateLikesMutation.mutate({ id, likes })
  }

  const deleteBlog = (id) => {
    deleteBlogMutation.mutate(id)
  }

  return (
    <div className='container'>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <Navbar bg='light' expand='lg'>
            <Navbar.Brand href='/' style={{ fontWeight: 'bold', color: '#696969' }}>Blog App</Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='me-auto'>
                <Nav.Link as={Link} to='/'>
                  Blogs
                </Nav.Link>
                <Nav.Link as={Link} to='/users'>
                  Users
                </Nav.Link>
              </Nav>
              <Navbar.Text className='me-2'>{user.name} is logged in</Navbar.Text>
              <Button variant='outline-dark' size='sm' onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Collapse>
          </Navbar>

          <Routes>
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id' element={<User />} />
            <Route
              path='/blogs/:id'
              element={
                <BlogView updateBlogLikes={updateBlogLikes} deleteBlog={deleteBlog} />
              }
            />
            <Route
              path='/'
              element={
                <div>
                  <h3>Blogs</h3>
                  {isLoading && <div>Loading blogs...</div>}

                  {isError && <div>Error loading blogs</div>}

                  {!isLoading && !isError && (
                    <div>
                      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
                        <BlogForm createBlog={addBlog} />
                      </Togglable>
                      <Table striped variant="light">
                        <tbody>
                          {blogs.map((blog) => (
                            <Blog
                              key={blog.id}
                              blog={blog}
                              updateBlogLikes={updateBlogLikes}
                              deleteBlog={deleteBlog}
                              user={user}
                            />
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              }
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
