const assert = require('assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


const api = supertest(app)
let token = null

/*beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  token = await helper.getValidToken()
  await Blog.insertMany(helper.initialBlogs)
})*/
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  // Get token and create test user
  token = await helper.getValidToken()
  const user = await User.findOne({ username: 'testuser' })
  
  // Create fresh copies of initial blogs with user reference
  const blogsToInsert = helper.initialBlogs.map(blog => ({
    ...blog,
    user: user._id
  }))
  
  await Blog.insertMany(blogsToInsert)
  global.testBlogs = blogsToInsert
  
  // Add blog references to user
  const savedBlogs = await Blog.find({})
  user.blogs = savedBlogs.map(blog => blog._id)
  await user.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns the correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, global.testBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  
  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(typeof blog.id, 'string')
  })
})

test('creates a new blog post with a valid token', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'John Doe',
    url: 'link',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, global.testBlogs.length + 1)
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'John Doe',
    url: 'link',
    likes: 0
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('token missing or invalid'))

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, global.testBlogs.length)
})

test ('if likes property is missing, it will default to the value 0', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'John Doe',
    url: 'link'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body.likes, 0)
})

test ('if the title or url properties are missing, respond with status code 400', async () => {
  const newBlog = {
    author: 'John Doe',
    likes: 0
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body.error, 'title and url are required')
})

test('deletes a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const contents = blogsAtEnd.map(b => b.title)
  assert(!contents.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, global.testBlogs.length - 1)
})

test ('updates a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const originalBlog = { ...blogToUpdate}

  const updatedBlog = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'Updated URL',
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.ok(updated)
  assert.deepStrictEqual(updated.title, 'Updated Title')
  assert.deepStrictEqual(updated.author, 'Updated Author')
  assert.deepStrictEqual(updated.url, 'Updated URL')
  assert.deepStrictEqual(updated.likes, 100)
  assert.strictEqual(blogsAtEnd.length, global.testBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})