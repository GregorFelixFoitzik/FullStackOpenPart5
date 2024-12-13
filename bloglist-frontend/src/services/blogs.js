import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  }
})

const getAll = async () => {
  const response = await axios.get(baseUrl)
  // https://stackoverflow.com/a/42499771
  return response.data.sort((blogA, blogB) => blogB.likes - blogA.likes)
}

const create = async newObject => {
  const { ...blogData } = newObject
  const config = getConfig()
  const response = await axios.post(baseUrl, blogData, config)
  return response.data
}

const update = async rawBlog => {
  const blogToUpdate = { 
    ...rawBlog, 
    user: rawBlog.user.id,
    likes: rawBlog.likes + 1
  }
  const response = await axios.put(`${baseUrl}/${blogToUpdate.id}`, blogToUpdate)
  return response.data
}

const remove = async rawBlog => {
  const { ...blogToDelete } = {
    ...rawBlog,
    user: rawBlog.user.id
  }

  const config = getConfig()
  const response = await axios.delete(`${baseUrl}/${blogToDelete.id}`, config)
  return response.data
}

export default { 
  setToken,
  getAll,
  create,
  update,
  remove,
}