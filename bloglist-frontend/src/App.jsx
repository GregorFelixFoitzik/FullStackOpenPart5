import { useState, useEffect } from 'react'

import { Blog, BlogForm } from './components/Blog'
import { LoginForm } from './components/Login'
import { Notification, ErrorMessage } from './components/Messages'
import { Togglable } from './components/toggable'

import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogsData, setBlogsData] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [userInfo, setUserInfo] = useState(null)

  const [updatedBlogs, setUpdatedBlogs] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogsData(blogs)
    }
    fetchBlogs()
  }, [updatedBlogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      loggedUser.authToken = loggedUser.token
      setUserInfo(loggedUser)
      blogService.setToken(loggedUser.authToken)
    }
  }, [])
  

  const createBlog = async (event) => {
    try {
      const returnedBlog = await blogService.create({
        ...event
      })
      setUpdatedBlogs(event)
      setInfoMessage(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const userLogIn = await loginService.login({
        username, password,
      }) 
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(userLogIn)
      )
      blogService.setToken(userLogIn.token)
      setUserInfo(userLogIn)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLike = async (blog) => {
    await blogService.update(blog)
    setUpdatedBlogs(blog) 
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blog.userToken = userInfo.token
      try {
        await blogService.remove(blog)
        setUpdatedBlogs(blog)
      } catch (exception) {
        setErrorMessage('Error deleting blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={infoMessage} />
      <ErrorMessage message={errorMessage} />
      {userInfo === null ?
        
        <Togglable buttonLabel='login'>
          <LoginForm onSubmit={handleLogin} setUsername={setUsername} setPassword={setPassword} username={username} password={password}/>
        </Togglable> :

        <div> 
          {userInfo.name} logged-in <button onClick={() => loginService.logout(setUserInfo)}>logout</button>
          <h2>create new</h2>
          <Togglable buttonLabel='new blog'>
            {/* createBlog={createBlog}  */}
            <BlogForm
              // newBlog={newBlog}
              // handleInputChange={handleInputChange}
              createBlog={createBlog}
            />
          </Togglable>
          <br />
          {blogsData.map(blog => 
            <Blog key={blog.id} 
              blog={blog} 
              clickAddLike={() => addLike(blog)} 
              clickDeleteBlog={() => deleteBlog(blog)}
            />)}
        </div>

      }
    </div>
  )
}

export default App;