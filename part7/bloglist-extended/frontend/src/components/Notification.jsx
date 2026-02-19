import { useNotificationValue } from '../contexts/NotificationContext'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification.message === null) {
    return null
  }

  const variant = notification.status === 'error' ? 'danger' : 'success'

  return <Alert variant={variant}>{notification.message}</Alert>
}

export default Notification
