import React, { useEffect, useState } from 'react'
import { Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import API from '../api/API'

const UsersContainer = props => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    API.getUsers().then(json => {
      setUsers(json)
    })
  }, [])

  const { handleUserClick } = props

  const renderUserCards = () =>
    users.length > 0 && users.map(user =>
      <Link className='userCard' key={user.id} to={`/users/${user.id}`}>
        <Image className='userCircle' circular src={user.avatar_url} size='tiny' wrapped onClick={() => handleUserClick(user)} />
        <p>{user.first_name}</p>
      </Link>
    )

  if (users.length === 0) return <h1>flixing...</h1>

  return (
    <Card.Group className='usersContainer' centered>
      {renderUserCards()}
    </Card.Group>
  )
}

export default UsersContainer