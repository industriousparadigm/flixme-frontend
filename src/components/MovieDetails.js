import React, { useState, useEffect } from 'react'
import { Image, Header, Button, Rating, Icon } from 'semantic-ui-react'
import API from '../api/API'

const MovieDetails = props => {
  const [movie, setMovie] = useState(null)
  const [userRating, setUserRating] = useState(null)

  useEffect(() => {
    console.log('*async* MovieDetails fetch hook')
    API.getMovie(props.movieId)
      .then(setMovie)
  }, [props.movieId])

  const { poster_path, title, release_date, overview, credits, runtime, genres } = movie || {}
  const { currentUser, reloadUser, history } = props

  const handleRating = (event, { rating }) =>
    API.postRating(currentUser.id, movie.id, rating) // change rating in back end
      .then(() => setUserRating(rating)) // change rating in the dom
      .then(reloadUser(currentUser.id)) // reload the current user

  const handleWatched = () => {
    userRating === null
      ? API.postRating(currentUser.id, movie.id, 0).then(() => {
        setUserRating(0)
        reloadUser(currentUser.id)
      })
      : API.deleteRating(currentUser.id, movie.id).then(() => {
        setUserRating(null)
        reloadUser(currentUser.id)
      })
  }

  useEffect(() => {
    console.log('MovieDetails loadCurrentUser hook')
    let userMovie
    if (currentUser) { userMovie = currentUser.movies.find(m => m.id === props.movieId) }
    if (userMovie) setUserRating(userMovie.user_rating)
  }, [currentUser])


  if (!movie) return <h1>loading</h1>

  return (
    <div className="moviePage">
      <section className='moviePoster'>
        <Image src={
          poster_path
            ? API.posterURL + poster_path
            : API.genericPosterURL
        } inline floated='left' rounded size='huge' ></Image>
      </section>
      <section className='movieInfo'>
        <Header as='h1' >{`${title} (${release_date.slice(0, 4)})`}</Header>
        <p>{credits.cast.slice(0, 4).map(actor => actor.name).join(', ')}</p>
        <p>{overview}</p>
        <p>{genres.map(genre => genre.name).join(', ')}</p>
        <p>{runtime ? `${runtime}m` : null}</p>
        <Button
          disabled={!currentUser ? true : false}
          onClick={handleWatched}>
          {
            userRating === null
              ? 'Mark as seen'
              : 'Mark as NOT seen'
          }
        </Button>
        <br />
        <br />
        <Rating
          className='movieRating'
          onRate={handleRating}
          maxRating={5}
          // defaultRating={current_user_rating ? current_user_rating : 0}
          rating={userRating}
          icon='star'
          size='massive'
          clearable
          disabled={!currentUser ? true : false}
        />
        <br /> <br />
        <Button icon onClick={history.goBack}>
          <Icon name='left arrow' />
        </Button>
      </section>
    </div>
  )
}

export default MovieDetails