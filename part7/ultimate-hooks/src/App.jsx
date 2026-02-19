import { useField, useResource } from './hooks'

const App = () => {
  const { reset: resetContent, ...contentInput } = useField('text')
  const { reset: resetName, ...nameInput } = useField('text')
  const { reset: resetNumber, ...numberInput } = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: contentInput.value })
    resetContent()
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: nameInput.value, number: numberInput.value})
    resetName()
    resetNumber()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...contentInput} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...nameInput} /> <br/>
        number <input {...numberInput} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App