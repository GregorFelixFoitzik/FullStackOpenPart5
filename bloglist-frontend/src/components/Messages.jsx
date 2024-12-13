import PropTypes from 'prop-types'

const Notification = ({ message  }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const ErrorMessage = ({ message  }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string
}
ErrorMessage.propTypes = {
  message: PropTypes.string
}

export {
  Notification,
  ErrorMessage
}