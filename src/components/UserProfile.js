import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image, Header, Button, Icon, Card } from 'semantic-ui-react'
import API from '../api/API'

import MovieCard from './MovieCard'

const UserProfile = props => {
  const [user, setUser] = useState(null)
  const [userMovies, setUserMovies] = useState([])

  useEffect(() => {
    console.log('UserDetails set user hook')
    setUser(props.users.find(u => props.userId === u.id))
    if (user) setUserMovies(user.movies.slice(0, 5))
  }, [props.userId, props.users, user])

  const { userId, users, currentUser, history } = props

  const renderMovieCards = () =>
    userMovies.map(movie =>
      <MovieCard key={movie.id} movie={movie} />
    )

  const renderUserCards = () =>
    user.friends.length > 0 && user.friends.map(friend =>
      <Link key={friend.id} className='userCard' to={`/users/${friend.id}`}>
        <Image className='userCircle' circular src={friend.avatar_url} size='tiny' wrapped />
        <p>{friend.first_name}</p>
      </Link>
    )

  const isFriend = () => {
    let friendship = false
    currentUser.friends.forEach(friend => {
      if (friend.id === user.id) { friendship = true }
    })
    return friendship
  }

  if (!user) return <h1>Loading</h1>

  return (
    <div className="userPage">
      <section className='userDetails'>
        <Image className='userProfileAvatar' circular src={user.avatar_url} size='medium' wrapped />
        <Header as='h1' >{user.first_name + ' ' + user.last_name}</Header>
        <p>watched {user.movies.length} movies</p>
      </section>
      <section className='userActivity'>
        <section className='userRecentMovies'>
          <Header as='h1' >Recently rated</Header>
          <Card.Group itemsPerRow={5} className='moviesContainer' centered >
            {renderMovieCards()}
          </Card.Group>
        </section>
        <section className='userFriends'>
          <Header as='h1'>Friends</Header>
          <Card.Group itemsPerRow={5} className='moviesContainer' centered >
            {renderUserCards()}
          </Card.Group>
        </section>
        <br />
        <br />
      </section>
      <section className='userOptions' >
        <Button size='massive' icon onClick={() => history.push('/users')}>
          <Icon name='left arrow' />
        </Button>
        {
          isFriend()
            ? <Button size='massive' icon onClick={() => API.terminateFriendship(currentUser.id, user.id)}>Remove friend</Button>
            : <Button size='massive' icon onClick={() => API.initiateFriendship(currentUser.id, user.id)}>Add as friend</Button>
        }
      </section>
    </div>
  )
}

export default UserProfile