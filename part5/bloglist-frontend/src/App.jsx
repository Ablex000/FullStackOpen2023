import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      // Sort blogs by likes in descending order
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))  // Fix key name
      blogService.setToken(user.token)  // Fix service name
      setUser(user)
      setUsername('')
      setPassword('')
      setStatus('success')
      setMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setStatus('error')
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    setStatus('success')
    setMessage('Logged out successfully')
    setTimeout(() => {setMessage(null)}, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to Application</h2>
      <div>
        Username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      // Sort blogs by likes in descending order after adding new blog
      const updatedBlogs = blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogs)

      setStatus('success')
      setMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

      blogFormRef.current.toggleVisibility()

    } catch (error) {
      setStatus('error')
      setMessage('Failed to create blog - ' + error.response.data.error)
      setTimeout(() => { setMessage(null) }, 5000)
    }
  }

  const updateBlogLikes = (updatedBlog) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ).sort((a, b) => b.likes - a.likes)

    setBlogs(updatedBlogs)
  }

  const deleteBlog = (id) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id)
    setBlogs(updatedBlogs)
    setStatus('success')
    setMessage('Blog deleted successfully')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      <Notification message={message} status={status} />
      {user === null ? loginForm() :
        <div>
          <h2>Blogs</h2>
          <p>{user.name} is logged in
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
              logout
            </button>
          </p>
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlogLikes={updateBlogLikes}
              deleteBlog={deleteBlog}
              user={user}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App