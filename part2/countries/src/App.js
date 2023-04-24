import { useState, useEffect } from 'react'
import axios from 'axios'
import SearchCountry from './components/SearchCountry'
import CountryInfo from './components/CountryInfo'

function App() {
  const [countries, setCountries] = useState([])
  const [searchFilter, setSearchFilter] = useState('')
  const [showCountry, setShowCountry] = useState({})

  const filteredCountries =  countries.filter(c => c.name.toLowerCase().includes(searchFilter.toLocaleLowerCase()))

  const handleChange = (event) => {
    setSearchFilter(event.target.value)
    setShowCountry({})
  }
  
  const handleShow = name => () => setShowCountry(filteredCountries.filter(c => c.name.includes(name))[0])
  
  useEffect(() => {
      axios
        .get(`https://restcountries.com/v3.1/all`)
        .then(response => {
          setCountries(response.data
            .map(({name, capital, area, languages, flags}) => ({name: name.common, capital, area, languages, flags})))
        })
  }, [])

  return (
      <div>
        <SearchCountry searchFilter={searchFilter} handleChange={handleChange}/>
        {filteredCountries.length > 10 && (<p>Too many matches, specify another filter</p>)}
        {filteredCountries.length <= 10 && filteredCountries.length > 1 
          && filteredCountries
            .map(c => <div key={c.name}>{c.name} 
              <button onClick={handleShow(c.name)}>show</button></div>)}
        {filteredCountries.length === 1 && <CountryInfo country={filteredCountries[0]}/>}
        {showCountry.name && <CountryInfo country={showCountry} />}
      </div>
  )
}

export default App