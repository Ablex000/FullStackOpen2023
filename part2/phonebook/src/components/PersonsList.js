import Person from './Person'

const PersonsList = ({persons, query, handleDeletePerson}) => {
    return (
        (persons
            .filter(x => x.name.toLowerCase().includes(query))
            .map(person => 
                    <Person key={person.name} 
                        person={person}
                        handleDeletePerson={handleDeletePerson} 
                    />
                ))
    )
}

export default PersonsList