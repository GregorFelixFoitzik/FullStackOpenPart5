import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogForm } from './Blog'

describe('<BlogForm />', () => {
  test('calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    render(<BlogForm
        createBlog={createBlog}
    />)

    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('URL')
    
    const sendButton = screen.getByText('create')    

    await user.type(titleInput, 'New Blog Title')
    await user.type(authorInput, 'New Blog Author')
    await user.type(urlInput, 'http://ecosia.org')
    
    await user.click(sendButton)

    expect(createBlog).toHaveBeenCalledTimes(1)    
    expect(createBlog.mock.calls[0][0].title).toBe('New Blog Title')
    expect(createBlog.mock.calls[0][0].author).toBe('New Blog Author')
    expect(createBlog.mock.calls[0][0].url).toBe('http://ecosia.org')
  })
})