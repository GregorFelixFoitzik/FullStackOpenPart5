const { test, expect, beforeEach, describe } = require('@playwright/test')
const { dbNewUser, loginWith, createBlog, checkBlogBackend } = require('./helper')
const { create } = require('domain')
const { link } = require('fs')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await dbNewUser(request, 'Gregor Foitzik', 'testUser', 'sekret')
    await dbNewUser(request, 'Max Muster', 'Max', 'sekret')
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testUser', 'sekret')
      await expect(page.getByText('Gregor Foitzik logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testUser', 'wrong')
      
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Gregor Foitzik logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testUser', 'sekret')
      await expect(page.getByText('Gregor Foitzik logged-in')).toBeVisible()
    })
  
    test('a new blog can be created (backend)', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await createBlog(page, 'Test Blog', 'Test Author', 'http://test.com')
      await request.get('http://localhost:3003/api/blogs')

      const createdBlog = await checkBlogBackend(request, 'Test Blog')
      expect(createdBlog).toMatchObject({
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 0
      })
    })

    test('a new blog can be created (frontend)', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await createBlog(page, 'Test Blog', 'Test Author', 'http://test.com')
      const errorDiv = await page.locator('.notification')
      await expect(errorDiv).toContainText("A new blog 'Test Blog' by Test Author added")
      await expect(page.getByText('Test Blog - Test Author')).toBeVisible()
    })
    
    test('a blog can be liked', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await createBlog(page, 'Test Blog', 'Test Author', 'http://test.com')
      await expect(page.getByText('Test Blog - Test Author')).toBeVisible()
      await page.locator('div').filter({ hasText: 'Test Blog' }).getByRole('button', { name: 'view' }).click()
      await page.locator('div').filter({ hasText: 'Test Blog' }).getByRole('button', { name: 'like' }).click()

      const createdBlog = await checkBlogBackend(request, 'Test Blog')
      expect(createdBlog).toMatchObject({
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 1
      })
    })

    test('a blog can be deleted', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await createBlog(page, 'Test Blog', 'Test Author', 'http://test.com')
       
      await page.locator('div').filter({ hasText: 'Test Blog' }).getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.locator('div').filter({ hasText: 'Test Blog' }).getByRole('button', { name: 'remove' }).click()

      await page.waitForTimeout(100)
      const createdBlog = await checkBlogBackend(request, 'Test Blog')
      expect(createdBlog).toBeUndefined()
    })
  })

  test('Only the creator can delete a blog', async ({ page, request }) => {
    await loginWith(page, 'testUser', 'sekret')
    await expect(page.getByText('Gregor Foitzik logged-in')).toBeVisible()
    await page.getByRole('button', { name: 'new blog' }).click()
    await createBlog(page, 'Test Blog', 'Test Author', 'http://test.com')
    await expect(page.getByText('Test Blog - Test Author')).toBeVisible()
    await page.getByRole('button', { name: 'logout' }).click()
    
    await loginWith(page, 'Max', 'sekret')
    await expect(page.getByText('Max Muster logged-in')).toBeVisible()
    await page.locator('div').filter({ hasText: 'Test Blog' }).getByRole('button', { name: 'view' }).click()

    await expect(page.locator('div').filter({ hasText: 'Test Blog' }).getByRole('button', { name: 'remove' })).not.toBeVisible()
  })

  test('Blogs are ordered by likes', async ({ page }) => {
    await loginWith(page, 'testUser', 'sekret')
    await page.getByRole('button', { name: 'new blog' }).click()
    await createBlog(page, 'Test Blog 1', 'Test Author 1', 'http://test1.com')
    await createBlog(page, 'Test Blog 2', 'Test Author 2', 'http://test2.com')
    await createBlog(page, 'Test Blog 3', 'Test Author 3', 'http://test3.com')

    await page.locator('div.blog-post').filter({ hasText: 'Test Blog 1' }).getByRole('button', { name: 'view' }).click()
    for (let i = 0; i < 2; i++) {
      await page.locator('div.blog-post').filter({ hasText: 'Test Blog 1' }).getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(20)
    }

    await page.locator('div.blog-post').filter({ hasText: 'Test Blog 2' }).getByRole('button', { name: 'view' }).click()
    for (let i = 0; i < 6; i++) {
      await page.locator('div.blog-post').filter({ hasText: 'Test Blog 2' }).getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(20)
    }

    await page.locator('div.blog-post').filter({ hasText: 'Test Blog 3' }).getByRole('button', { name: 'view' }).click()
    for (let i = 0; i < 4; i++) {
      await page.locator('div.blog-post').filter({ hasText: 'Test Blog 3' }).getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(20)
    }

    const blogs = await page.locator('.blog-post')
    const blogTitles = await blogs.evaluateAll(blogElements => blogElements.map(blog => blog.textContent))
    
    await expect(blogTitles[0]).toContain('Test Blog 2')
    await expect(blogTitles[1]).toContain('Test Blog 3')
    await expect(blogTitles[2]).toContain('Test Blog 1')
  })
})