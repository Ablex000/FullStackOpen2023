import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper.js'

test.beforeEach(async ({ page, request }) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      username: 'testuser',
      password: 'test123456',
      name: 'Test User'
    }
  })

  await page.goto('/')
})

test.describe('Blog app', () => {
  test('Login form is shown', async ({ page }) => {
    const loginButton = await page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })
})

test.describe('Login', () => {
  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'test123456')
    await expect(page.getByText('Welcome Test User')).toBeVisible()
  })
  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'testuser', 'wrongpassword')
    await expect(page.getByText('Wrong username or password')).toBeVisible()
  })
})

test.describe('When logged in', () => {
  test.beforeEach(async ({ page }) => {
    await loginWith(page, 'testuser', 'test123456')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Test Blog Title', 'Test Author', 'https://testblog.com')
    await page.locator('.blog-title-author').filter({ hasText: 'Test Blog Title' }).waitFor()
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlog(page, 'Test Blog for Liking', 'Test Author', 'https://testblog.com')

    const blogItem = page.locator('.blog-title-author').filter({ hasText: 'Test Blog for Liking' })
    await blogItem.waitFor()

    await blogItem.locator('..').getByRole('button', { name: 'view' }).click()

    const likesElement = page.locator('.blog-details').getByRole('button', { name: 'like' })
    await likesElement.click()
    await expect(page.locator('.blog-details')).toContainText('1 like')
  })

  test('a blog can be deleted by the creator', async ({ page }) => {
    await createBlog(page, 'Blog to Delete', 'Test Author', 'https://testblog.com')

    const blogItem = page.locator('.blog-title-author').filter({ hasText: 'Blog to Delete' })
    await blogItem.waitFor()

    await blogItem.locator('..').getByRole('button', { name: 'view' }).click()

    page.on('dialog', async dialog => {
      await dialog.accept()
    })

    const deleteButton = page.locator('.blog-details').getByRole('button', { name: 'remove' })
    await deleteButton.click()

    await expect(blogItem).not.toBeVisible()
  })

  test('only the user who added the blog sees the delete button', async ({ page, request }) => {
    await createBlog(page, 'My Blog', 'Test Author', 'https://myblog.com')

    const blogItem = page.locator('.blog-title-author').filter({ hasText: 'My Blog' })
    await blogItem.waitFor()
    await blogItem.locator('..').getByRole('button', { name: 'view' }).click()

    const deleteButton = page.locator('.blog-details').getByRole('button', { name: 'remove' })
    await expect(deleteButton).toBeVisible()

    await page.getByRole('button', { name: 'logout' }).click()
    await page.reload()

    await request.post('/api/users', {
      data: {
        username: 'otheruser',
        password: 'test123456',
        name: 'Other User'
      }
    })

    await loginWith(page, 'otheruser', 'test123456')

    const blogItemForOtherUser = page.locator('.blog-title-author').filter({ hasText: 'My Blog' })
    await blogItemForOtherUser.waitFor()
    await blogItemForOtherUser.locator('..').getByRole('button', { name: 'view' }).click()

    const deleteButtonForOtherUser = page.locator('.blog-details').getByRole('button', { name: 'remove' })
    await expect(deleteButtonForOtherUser).not.toBeVisible()
  })

  test('blogs are arranged in order according to likes with most likes first', async ({ page }) => {

    await createBlog(page, 'Blog with Few Likes', 'Author One', 'https://few.com')
    await page.waitForTimeout(500)
    await createBlog(page, 'Blog with Many Likes', 'Author Two', 'https://many.com')
    await page.waitForTimeout(500)
    await createBlog(page, 'Blog with No Likes', 'Author Three', 'https://none.com')
    await page.waitForTimeout(500)

    let blogItem = page.locator('.blog-title-author').filter({ hasText: 'Blog with Many Likes' })
    await blogItem.locator('..').getByRole('button', { name: 'view' }).click()

    for (let i = 0; i < 5; i++) {
      await page.locator('.blog-details').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
    }

    await blogItem.locator('..').getByRole('button', { name: 'hide' }).click()


    blogItem = page.locator('.blog-title-author').filter({ hasText: 'Blog with Few Likes' })
    await blogItem.locator('..').getByRole('button', { name: 'view' }).click()

    for (let i = 0; i < 2; i++) {
      await page.locator('.blog-details').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
    }

    await blogItem.locator('..').getByRole('button', { name: 'hide' }).click()

    const blogTitles = page.locator('.blog-title-author')
    const firstBlog = blogTitles.nth(0)
    const secondBlog = blogTitles.nth(1)
    const thirdBlog = blogTitles.nth(2)


    await expect(firstBlog).toContainText('Blog with Many Likes')
    await expect(secondBlog).toContainText('Blog with Few Likes')
    await expect(thirdBlog).toContainText('Blog with No Likes')
  })
})