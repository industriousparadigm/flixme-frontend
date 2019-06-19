import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Image, Header, Button, Icon, Card, Form } from 'semantic-ui-react'
import API from '../api/API'

import MovieCard from './MovieCard'

const UserProfile = props => {
  const [user, setUser] = useState(null)
  const [avatarFormValue, setAvatarFormValue] = useState('')

  useEffect(() => {
    API.getUser(props.userId)
      .then(u => {
        setUser(u)
      })
  }, [props.userId, props.currentUser])

  const { currentUser, reloadCurrentUser, history } = props

  const renderMovieCards = () => {
    return user.movies.slice(0, 5).map(movie =>
      <MovieCard
        key={movie.id}
        movie={movie}
        currentUser={user}
        reloadCurrentUser={reloadCurrentUser}
        allowEdit={currentUser && user.id === currentUser.id ? true : false} />
    )
  }

  const renderUserCards = () =>
    user.friends.length > 0 && user.friends.map(friend =>
      <Link key={friend.id} className='userCard' to={`/users/${friend.id}`}>
        <Image className='userCircle' circular src={friend.avatar_url} size='tiny' wrapped />
        <p>{friend.first_name}</p>
      </Link>
    )

  const isFriend = () => {
    let friendship = false
    currentUser && currentUser.friends.forEach(friend => {
      if (friend.id === user.id) { friendship = true }
    })
    return friendship
  }

  const handleFriendButton = () => {
    if (!isFriend()) { // create friendship in backend + refresh user's friends array
      API.initiateFriendship(currentUser.id, user.id)
        .then(reloadCurrentUser)
    } else {
      API.terminateFriendship(currentUser.id, user.id)
        .then(reloadCurrentUser)
    }
  }

  // const handleAvatarButton = event => {
  //   event.preventDefault()
  //   const editedUser = { id: user.id, avatar_url: avatarFormValue }
  //   API.editUser(editedUser).then(setUser)
  // }


  if (!user) return <h1>flixing...</h1>

  return (
    <div className="userPage">
      <section className='userDetails'>
        <Image className='userProfileAvatar' circular src={user.avatar_url} size='medium' wrapped /> <br /> <br />
        {/* {
          currentUser.id === user.id && <Form>
            <Form.Input placeholder='URL here' onChange={event => setAvatarFormValue(event.target.value)} />
            <Button size='tiny' onClick={handleAvatarButton}>change avatar</Button>
          </Form>
        } */}
        <Header as='h1' >{user.name}</Header>
        <p>watched {user.movies.length} movies</p>
        <Button size='massive' icon onClick={() => history.goBack()}>
          <Icon name='left arrow' />
        </Button>
        {
          currentUser && <Button size='massive' icon onClick={handleFriendButton} disabled={currentUser.id === user.id ? true : false}>
            {isFriend() ? 'remove friend' : 'add friend'}
          </Button>
        }
      </section>
      <section className='userActivity'>
        <section className='userRecentMovies'>
          <Header as='h1'>Recently rated</Header>
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
    </div>
  )
}

export default UserProfile