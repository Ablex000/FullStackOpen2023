import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not URL or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  // Check that title and author are visible
  expect(screen.getByText('Component testing is done with react-testing-library', { exact: false })).toBeDefined()
  expect(screen.getByText('Test Author', { exact: false })).toBeDefined()

  // Check that blog details (containing URL and likes) are not rendered by default
  const blogDetailsElement = container.querySelector('.blog-details')
  expect(blogDetailsElement).toBeNull()
})

test('shows URL and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockUser = {
    username: 'testuser',
    name: 'Test User'
  }

  const { container } = render(
    <Blog
      blog={blog}
      user={mockUser}
      updateBlogLikes={() => {}}
      deleteBlog={() => {}}
    />
  )

  const user = userEvent.setup()

  // Click the view button
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // Check that URL and likes are now visible
  const blogDetailsElement = container.querySelector('.blog-details')
  expect(blogDetailsElement).not.toBeNull()
  expect(screen.getByText('https://testblog.com', { exact: false })).toBeDefined()
  expect(screen.getByText('Likes: 5', { exact: false })).toBeDefined()
})

// Mock the blog service
vi.mock('../services/blogs', () => ({
  default: {
    updateLikes: vi.fn(() => Promise.resolve({ likes: 6, id: '123' }))
  }
}))

test('clicking like button twice calls event handler twice', async () => {
  const blog = {
    id: '123',
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockUser = {
    username: 'testuser',
    name: 'Test User'
  }

  const mockUpdateLikes = vi.fn()

  render(
    <Blog
      blog={blog}
      user={mockUser}
      updateBlogLikes={mockUpdateLikes}
      deleteBlog={() => {}}
    />
  )

  const user = userEvent.setup()

  // First, click the view button to show the details
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // Find the like button and click it twice
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  // Verify the event handler was called twice
  expect(mockUpdateLikes.mock.calls).toHaveLength(2)
})