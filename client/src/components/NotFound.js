import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div>Denne siden eksisterer ikke. Vennligst returner til <Link to="/">startsiden</Link> </div>
  )
}

export default NotFound