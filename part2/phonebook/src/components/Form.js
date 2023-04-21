const Form = ({name, number, handleAddName, handleAddNumber, handleAddPerson}) => {
    return (
        <form onSubmit={handleAddPerson}>
        <div>
          <p>name: <input value={name} onChange={handleAddName} /></p>
          <p>number: <input value={number} onChange={handleAddNumber} /></p>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default Form