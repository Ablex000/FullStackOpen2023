import { useSelector } from "react-redux"

const Notification = () => {
  const notification = useSelector(state => state.notification)
  
  if (!notification) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724',
    borderRadius: '4px'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification