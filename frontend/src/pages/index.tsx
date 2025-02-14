import React from 'react'
import UserInsterface from '../components/UserInsterface'

const Home: React.FC = () => {
  return (
    <div>
      <UserInsterface backendName="flask" />
    </div>
  )
}

export default Home;