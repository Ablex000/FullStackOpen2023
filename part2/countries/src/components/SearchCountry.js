import React from 'react'

const SearchCountry = ({searchFilter, handleChange}) => {
    return (
        <div>
            <p>Find countries <input value={searchFilter} onChange={handleChange} /></p>
        </div>
    )
}

export default SearchCountry