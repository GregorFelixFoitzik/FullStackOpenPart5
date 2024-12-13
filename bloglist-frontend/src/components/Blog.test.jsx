import { render, screen, fireEvent } from '@testing-library/react'
import { Blog } from './Blog'

describe('<Blog />', () => {
  let container
  const clickAddLike = vi.fn()
  const clickDeleteBlog = vi.fn()

  beforeEach(() => {
    const blog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 8,
      user: {
        username: "test_user",
        name: "Supertester",
        id: "67575a51722d7c1f8cec1812"
      },
      id: "675823727f9924cf2666c0b7"
    }

    container = render(
      <Blog key={blog.id} blog={blog} clickAddLike={clickAddLike} clickDeleteBlog={clickDeleteBlog}/>
    ).container
  })

  test('renders content', () => {
    const defaultView = container.querySelector('.Default Blog View')
    expect(defaultView).toBeDefined()

    const extendedView = container.querySelector('.Extended Blog View')
    expect(extendedView).toBeNull()
  })
  
  test('url and likes are shown when the button is clicked', () => {  
    const button = screen.getByText('view')
    fireEvent.click(button)
  
    const defaultView = container.querySelector('.Default Blog View')
    expect(defaultView).toBeDefined()

    const extendedView = container.querySelector('.Extended Blog View')
    expect(extendedView).toBeDefined()
  })
  
  test('clicking the like button twice calls event handler twice', () => {
    const button = screen.getByText('view')
    fireEvent.click(button)
  
    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
  
    expect(clickAddLike).toHaveBeenCalledTimes(2)
  })
})