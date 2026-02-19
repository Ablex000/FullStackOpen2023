import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    })
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }
  return (
    <div>
      <h5>Create New Blog</h5>

      <Form onSubmit={addBlog}>
        <Form.Group className='mb-3'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            data-testid='title'
            value={newBlogTitle}
            onChange={(e) => setNewBlogTitle(e.target.value)}
            placeholder='Enter blog title'
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Author</Form.Label>
          <Form.Control
            type='text'
            data-testid='author'
            value={newBlogAuthor}
            onChange={(e) => setNewBlogAuthor(e.target.value)}
            placeholder='Enter author name'
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type='text'
            data-testid='url'
            value={newBlogUrl}
            onChange={(e) => setNewBlogUrl(e.target.value)}
            placeholder='Enter blog URL'
          />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Create
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
