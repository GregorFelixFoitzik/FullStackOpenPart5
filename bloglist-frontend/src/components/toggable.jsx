import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      {visible && <div>
        {props.children}
        <button onClick={toggleVisibility}>hide</button>
      </div>
      }
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export {
  Togglable
}