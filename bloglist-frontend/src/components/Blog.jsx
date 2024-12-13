import { useState } from 'react'
import { Togglable } from './toggable'
import PropTypes from 'prop-types'

const Blog = ({ blog, clickAddLike, clickDeleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='SingleBl'>
      <div className='Default Blog View'>
        {blog.title} - {blog.author}
      </div>
      <Togglable buttonLabel='view'>
      <div className='Extended Blog View'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={clickAddLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div>
          <button onClick={clickDeleteBlog}>remove</button>
        </div>
      </div>
      </Togglable>
    </div>
  )
}

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange = (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const onSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: title, 
      author: author,
      url: url 
    })
  }
  
  return (<div><br />
    <form onSubmit={onSubmit} className='createBlogForm'>
      <div><input 
        id='blog-title'
        type="text"
        value={title}
        name="title"
        placeholder="Title"
        onChange={handleTitleChange}
      /></div>
      <div><input
        id='blog-author'
        type="text"
        value={author}
        name="author"
        placeholder="Author"
        onChange={handleAuthorChange}
      /></div>
      <div><input
        id='blog-url'
        type="text"
        value={url}
        name="url"
        placeholder="URL"
        onChange={handleUrlChange}
      /></div>
    <button id='submit-blog-form' type="submit">create</button>
    </form>  
  </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  clickAddLike: PropTypes.func.isRequired,
  clickDeleteBlog: PropTypes.func.isRequired
}

BlogForm.propTypes = {  
  createBlog: PropTypes.func.isRequired
}

export {
  Blog,
  BlogForm
}