import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setTimedNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    
    if (content.trim() === '') {
      dispatch(setTimedNotification('Cannot add an empty anecdote!', 5))
      return
    }

    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setTimedNotification(`New anecdote '${content}' created!`, 5))
  }

    return (
        <div>
            <h2>Create New Anecdote</h2>
            <form onSubmit={addAnecdote}>
                <input name="anecdote" placeholder="Add a new anecdote..." />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm