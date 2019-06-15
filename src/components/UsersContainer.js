import React from 'react'
import { Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const UsersContainer = props => {
  const { users, handleUserClick } = props

  const renderUserCards = () =>
    users.length > 0 && users.map(user =>
      <Link className='userCard' key={user.id} to={`/users/${user.id}`}>
        <Image className='userCircle' circular src={user.avatar_url} size='tiny' wrapped onClick={() => handleUserClick(user)} />
        <p>{user.first_name}</p>
      </Link>
    )

  return (
    <Card.Group itemsPerRow={5} className='usersContainer' centered >
      {renderUserCards()}
    </Card.Group>
  )
}

export default UsersContainer