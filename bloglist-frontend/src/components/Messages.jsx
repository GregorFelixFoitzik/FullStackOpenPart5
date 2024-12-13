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

const ShowError = ({ message  }) => {
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
ShowError.propTypes = {
  message: PropTypes.string
}

export {
  Notification,
  ShowError
}