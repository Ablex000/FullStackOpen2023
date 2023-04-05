import { useState } from 'react'

const StatisticLine = (props) => {
  return (
      <tr><td>{props.text}</td><td>{props.value}</td></tr>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
      <table>
        <tbody>
          <StatisticLine text="Good" value={props.good} />
          <StatisticLine text="Neutral" value={props.neutral} />
          <StatisticLine text="Bad" value={props.bad} />
          <StatisticLine text="All" value={props.all} />
          <StatisticLine text="Average" value={props.average} />
          <StatisticLine text="Postive" value={props.positive+" %"} />
        </tbody>
      </table>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] =useState(0)
  const average = (good*1 + bad*-1 + neutral*0)/all
  const positive = good*100/all
  
  const setToGood = newGood => {
    setGood(newGood)
    setAll(newGood+neutral+bad)
  }

  const setToNeutral = newNeutral => {
    setNeutral(newNeutral)
    setAll(good+newNeutral+bad)
  }

  const setToBad = newBad => {
    setBad(newBad)
    setAll(good+neutral+newBad)
  }
  
  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App