import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useUserValue } from '../contexts/UserContext'
import { Card, Button, ListGroup, Form, Badge } from 'react-bootstrap'

const BlogView = ({ updateBlogLikes, deleteBlog }) => {
  const { id } = useParams()
  const user = useUserValue()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blog = blogs?.find((b) => b.id === id)

  const [likes, setLikes] = useState(blog?.likes || 0)

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes || 0)
    }
  }, [blog])

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setComment('')
    },
    onError: (error) => {
      console.error('Error adding comment:', error)
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading blog</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }

  const handleLike = () => {
    setLikes(likes + 1)
    updateBlogLikes(blog.id, likes + 1)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    if (comment.trim()) {
      addCommentMutation.mutate({ id: blog.id, comment })
    }
  }

  const showDeleteButton =
    user &&
    blog.user &&
    (user.username === blog.user.username || user.id === blog.user.id || user.id === blog.user)

  return (
    <div>
      <Card className='mb-3'>
        <Card.Body>
          <Card.Title as='h2'>{blog.title}</Card.Title>
          <Card.Text>
            <a href={blog.url} target='_blank' rel='noopener noreferrer'>
              {blog.url}
            </a>
          </Card.Text>
          <div className='mb-2'>
            <Badge bg='primary' className='me-2'>
              {likes} likes
            </Badge>
            <Button variant='primary' size='sm' onClick={handleLike}>
              like
            </Button>
          </div>
          <Card.Text className='text-muted'>
            Added by {blog.user ? blog.user.name : 'unknown'}
          </Card.Text>
          {showDeleteButton && (
            <Button variant='danger' size='sm' onClick={handleDelete}>
              Remove
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header as='h5'>Comments</Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddComment} className='mb-3'>
            <Form.Group>
              <Form.Control
                type='text'
                value={comment}
                onChange={({ target }) => setComment(target.value)}
                placeholder='Add a comment...'
              />
            </Form.Group>
            <Button variant='primary' type='submit' size='sm' className='mt-2'>
              add a comment
            </Button>
          </Form>

          {blog.comments && blog.comments.length > 0 ? (
            <ListGroup as="ol" numbered>
              {blog.comments.map((c, index) => (
                <ListGroup.Item key={index}>{c}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className='text-muted'>No comments yet.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default BlogView
