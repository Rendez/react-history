import { PropTypes } from 'react'

export const action = PropTypes.oneOf([
  'PUSH',
  'REPLACE',
  'POP'
])

export const historyContext = PropTypes.shape({
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  prompt: PropTypes.func.isRequired
})

export const location = PropTypes.shape({
  path: PropTypes.string.isRequired,
  state: PropTypes.object,
  key: PropTypes.string
})
