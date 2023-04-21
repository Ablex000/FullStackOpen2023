import { useState, useEffect } from 'react'
import Search from './components/Search'
import Form from './components/Form'
import PersonsList from './components/PersonsList'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {name: newName, number: newNumber, id: newName}
    if (persons.find(x => x.name === newName)) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
          personService
            .update(personObject.id, personObject)
            .then(updatedPerson => {
              setPersons(persons.map(person => person.id !== personObject.id ? person : updatedPerson))
            })
            .catch(error => {
              setStatus('error')
              setMessage(`Information of ${personObject.name} has already been removed from server`)
              setTimeout(() => {setMessage(null)}, 5000)
              setPersons(persons.filter(p => p.id !== personObject.id))
            })
        }
    } else {
        personService
          .create(personObject)
          .then(addedPerson => {
            setPersons(persons.concat(addedPerson))
            setStatus('success')
            setMessage(`Added ${addedPerson.name}`)
            setTimeout(() => {setMessage(null)}, 5000)
            setNewName('')
            setNewNumber('')
        })
      }
    }

  const deletePerson = (personToDelete) => () => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(personToDelete.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })
    }
  }

  const handleChange = setValue => (event) => {setValue(event.target.value)}

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} status={status} />
      <Search query={filterQuery} handleChange={handleChange(setFilterQuery)} />

      <h2>Add a new</h2>
      <Form name={newName} number={newNumber} 
        handleAddName={handleChange(setNewName)} 
        handleAddNumber={handleChange(setNewNumber)} 
        handleAddPerson={addPerson} />

      <h2>Numbers</h2>
      <PersonsList 
        persons={persons} 
        query={filterQuery}
        handleDeletePerson={deletePerson}
      />
    </div>
  )
}

export default App