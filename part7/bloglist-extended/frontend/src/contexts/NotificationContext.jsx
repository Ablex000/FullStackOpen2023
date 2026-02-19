import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      message: action.payload.message,
      status: action.payload.status,
    }
  case 'CLEAR_NOTIFICATION':
    return {
      message: null,
      status: null,
    }
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: null,
    status: null,
  })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const setNotification = (dispatch, message, status, timeout = 5000) => {
  dispatch({
    type: 'SET_NOTIFICATION',
    payload: { message, status },
  })

  setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }, timeout)
}

export default NotificationContext
