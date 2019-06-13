import React from 'react'
import { Image, Header, Button, Icon, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'


const UserProfile = props => {
  const { movies, user, currentUser, history } = props

  const renderMovieCards = () =>
    movies.length > 0 && movies.slice(-5).map(movie =>
      <MovieCard key={movie.id} movie={movie} />
    )

  const renderUserCards = () =>
    user.friends.length > 0 && user.friends.map(friend =>
      <Link key={friend.id} to={`/users/${friend.id}`}>
        <Image className='friendCard' circular src={friend.avatar_url} size='tiny' wrapped />
        <p>{friend.first_name}</p>
      </Link>
    )

  const isFriend = userId => {
    let friendship = false
    currentUser.friends.forEach(friend => {
      if (friend.id === userId) { friendship = true }
    })
    return friendship
  }

  return (
    <div className="userPage">
      <section className='userDetails'>
        <Image className='userProfileAvatar' circular src={user.avatar_url} size='medium' wrapped />
        <Header as='h1' >{user.first_name + ' ' + user.last_name}</Header>
        <p>watched {user.movies_watched.length} movies</p>
      </section>
      <section className='userActivity'>
        <section className='userRecentMovies'>
          <Header as='h1' >Recently watched</Header>
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
          isFriend(user.id)
            ? <Button size='massive' icon onClick={history.goBack}>Remove friend</Button>
            : <Button size='massive' icon onClick={null}>Add as friend</Button>

        }

      </section>
    </div>
  )
}

export default UserProfile