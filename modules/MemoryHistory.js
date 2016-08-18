import warning from 'warning'
import invariant from 'invariant'
import React, { PropTypes } from 'react'
import { createKey } from './LocationKeys'
import HistoryContext from './HistoryContext'

const clamp = (n, lowerBound, upperBound) =>
  Math.min(Math.max(n, lowerBound), upperBound)

/**
 * A history that stores its own URL entries.
 */
class MemoryHistory extends React.Component {
  static propTypes = {
    basename: PropTypes.string,
    children: PropTypes.func.isRequired,
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    keyLength: PropTypes.number
  }

  static defaultProps = {
    initialEntries: [ { path: '/' } ],
    initialIndex: 0,
    keyLength: 6
  }

  state = {
    prevIndex: null,
    action: null,
    index: null,
    entries: null
  }

  createKey() {
    return createKey(this.props.keyLength)
  }

  handlePrompt = (prompt) => {
    invariant(
      typeof prompt === 'function',
      'A <MemoryHistory> prompt must be a function'
    )

    warning(
      this.prompt == null,
      '<MemoryHistory> supports only one <Prompt> at a time'
    )

    this.prompt = prompt

    return () => {
      if (this.prompt === prompt)
        this.prompt = null
    }
  }

  confirmTransitionTo(action, location, callback) {
    const prompt = this.prompt

    if (typeof prompt === 'function') {
      prompt({ action, location }, callback)
    } else {
      callback(true)
    }
  }

  handlePush = (path, state) => {
    const action = 'PUSH'
    const key = this.createKey()
    const location = {
      path,
      state,
      key
    }

    this.confirmTransitionTo(action, location, (ok) => {
      if (!ok)
        return

      this.setState(prevState => {
        const prevIndex = prevState.index
        const entries = prevState.entries.slice(0)

        const nextIndex = prevIndex + 1
        if (entries.length > nextIndex) {
          entries.splice(nextIndex, entries.length - nextIndex, location)
        } else {
          entries.push(location)
        }

        return {
          prevIndex: prevState.index,
          action,
          index: nextIndex,
          entries
        }
      })
    })
  }

  handleReplace = (path, state) => {
    const action = 'REPLACE'
    const key = this.createKey()
    const location = {
      path,
      state,
      key
    }

    this.confirmTransitionTo(action, location, (ok) => {
      if (!ok)
        return

      this.setState(prevState => {
        const prevIndex = prevState.index
        const entries = prevState.entries.slice(0)

        entries[prevIndex] = location

        return {
          prevIndex: prevState.index,
          action,
          entries
        }
      })
    })
  }

  handleGo = (n) => {
    const { index, entries } = this.state
    const nextIndex = clamp(index + n, 0, entries.length - 1)

    const action = 'POP'
    const location = entries[nextIndex]

    this.confirmTransitionTo(action, location, (ok) => {
      if (ok) {
        this.setState({
          prevIndex: index,
          action,
          index: nextIndex
        })
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        this.forceUpdate()
      }
    })
  }

  componentWillMount() {
    const { initialEntries, initialIndex } = this.props

    this.setState({
      action: 'POP',
      index: clamp(initialIndex, 0, initialEntries.length - 1),
      entries: initialEntries
    })
  }

  render() {
    const { basename, children } = this.props
    const { action, index, entries } = this.state
    const location = entries[index]

    return (
      <HistoryContext
        basename={basename}
        children={children}
        action={action}
        location={location}
        prompt={this.handlePrompt}
        push={this.handlePush}
        replace={this.handleReplace}
        go={this.handleGo}
      />
    )
  }
}

export default MemoryHistory
