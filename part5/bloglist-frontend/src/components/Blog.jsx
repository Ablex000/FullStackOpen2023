import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogLikes, deleteBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes || 0)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = async () => {
    try {
      // Only send the likes field to the specific likes endpoint
      const response = await blogService.updateLikes(blog.id, likes + 1)
      setLikes(response.likes)

      // Update parent component with the updated blog for sorting
      updateBlogLikes(response)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        deleteBlog(blog.id)
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // Check if current user is the creator of the blog
  const showDeleteButton = user && blog.user && (
    user.username === blog.user.username ||
  user.id === blog.user.id ||
  user.id === blog.user
  )

  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} - {blog.author}
        <button onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div className="blog-details">
          <div>URL: {blog.url}</div>
          <div>Likes: {likes} <button onClick={handleLike} >like</button></div>
          <div>Added by: {blog.user ? blog.user.name : 'unknown'}</div>
          {showDeleteButton && (
            <div>
              <button onClick={handleDelete} style={{ backgroundColor: 'lightcoral' }} >
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog