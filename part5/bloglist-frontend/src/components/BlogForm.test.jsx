import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls event handler with right details when a new blog is created', async () => {
  const mockCreateBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={mockCreateBlog} />)

  // Find form inputs using container.querySelectorAll to get all inputs
  const inputs = container.querySelectorAll('input')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]
  const createButton = screen.getByText('Create')

  // Fill in the form
  await user.type(titleInput, 'Testing React forms')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://testblog.com')

  // Submit the form
  await user.click(createButton)

  // Verify the event handler was called with correct details
  expect(mockCreateBlog).toHaveBeenCalledTimes(1)
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Testing React forms',
    author: 'Test Author',
    url: 'https://testblog.com'
  })
})