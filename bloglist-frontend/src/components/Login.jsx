import PropTypes from 'prop-types'

const LoginForm = ({
  onSubmit,
  username,
  password,
  setUsername,
  setPassword
}) => (
  <form onSubmit={onSubmit}>
      <div>
        username
          <input
          id='username'
          type="text"
          value={username}
          placeholder='Username'
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          id='password'
          type="password"
          value={password}
          placeholder='Password'
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>
)

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired
}

export {
  LoginForm
}