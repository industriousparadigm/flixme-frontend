import React from 'react'
import { Image, Header, Button, Rating, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


const UserProfile = props => {
  const { firstName, lastName, avatarUrl } = props.user

  return (
    <div className="userPage">
      <section className='userDetails'>
        <Image src={avatarUrl} size='medium' wrapped />
        <Header as='h1' >{firstName + ' ' + lastName}</Header>
      </section>
      <section className='userActivity'>
        <section className='userRecentMovies'>
          <Header as='h1' >Recently watched</Header>
        </section>
        <section className='userFriends'>
          <Header as='h1' >Friends</Header>
        </section>
        <br />
        <br />
        <Button icon as={Link} to={`/`}>
          <Icon name='left arrow' />
        </Button>
      </section>
    </div>
  )
}

export default UserProfile