import React from 'react'

const CrimeRateBadge = ({ crimeRate, stateName }) => {
  const getCrimeLevel = (rate) => {
    if (rate <= 15) return { level: 'Low', class: 'crime-low' }
    if (rate <= 25) return { level: 'Medium', class: 'crime-medium' }
    return { level: 'High', class: 'crime-high' }
  }

  const crimeInfo = getCrimeLevel(crimeRate)

  return (
    <div className="crime-card">
      <h3>{stateName}</h3>
      <div className="crime-rate">{crimeRate}%</div>
      <p>Crime Rate - {crimeInfo.level}</p>
      <div className="crime-meter">
        <div 
          className={`crime-level ${crimeInfo.class}`}
          style={{ width: `${crimeRate}%` }}
        ></div>
      </div>
      <div className="crime-labels">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  )
}

export default CrimeRateBadge