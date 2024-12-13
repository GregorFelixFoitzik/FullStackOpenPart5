const dbNewUser = async (request, name, username, password) => {
  await request.post('http://localhost:3003/api/users', {
  data: {
    name: name,
    username: username,
    password: password
  }
  })
}

const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'submit login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByTestId('blog-title').fill(title)
  await page.getByTestId('blog-author').fill(author)
  await page.getByTestId('blog-url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const checkBlogBackend = async (request, title) => {
  const response = await request.get('http://localhost:3003/api/blogs')
  const blogs = await response.json()
  const createdBlog = await blogs.find(blog => blog.title === title)
  return createdBlog
}

export { dbNewUser, loginWith, createBlog, checkBlogBackend }