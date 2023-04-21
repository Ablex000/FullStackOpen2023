const Search = ({ query, handleChange }) => {
    return (
        <p>Filter shown with <input value={query} onChange={handleChange} /></p>
    )
}

export default Search