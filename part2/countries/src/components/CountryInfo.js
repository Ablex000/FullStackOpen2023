import axios from "axios"
import { useState } from 'react'

const convertToC = kelvin => parseFloat(kelvin - 273.15).toFixed(1)
    
const CountryInfo = ({country}) => {
    const [temp, setTemp] = useState(0)
    const [wind, setWind] = useState(0)
    const [icon, setIcon] = useState('')

    axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${process.env.REACT_APP_API_KEY}`)
        .then (response => {
            console.log(response.data)
            setTemp(convertToC(response.data.main.temp))
            setWind(response.data.wind.speed)
            setIcon(response.data.weather[0].icon)
        })

    return (
        <div>
          <h1>{country.name}</h1>
          <p>capital {country.capital}<br/>area {country.area}</p>
          <h2>languages:</h2>
          <ul>{Object.values(country.languages).map(l => (<li key={l}>{l}</li>))}</ul>
          <p><img src={country.flags.png} alt={`${country.name} flag`} width='250px'/></p>
          <h2>Weather in {country.capital}</h2>
          <p>temperature {temp} Celsius</p>
          <p><img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={`${country.capital} weather`} /></p>
          <p>wind {wind} m/s</p>
        </div>
    )
}

export default CountryInfo