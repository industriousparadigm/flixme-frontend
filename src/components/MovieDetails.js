import React, { useState, useEffect } from 'react'
import { Image, Header, Button, Rating, Icon, Modal } from 'semantic-ui-react'
import API from '../api/API'

const MovieDetails = props => {
  const [movie, setMovie] = useState(null)
  const [userRating, setUserRating] = useState(null)

  useEffect(() => {
    API.getMovie(props.movieId)
      .then(setMovie)
  }, [props.movieId])

  const { poster_path, title, release_date, overview, credits, runtime, genres } = movie || {}
  const { currentUser, reloadCurrentUser, history } = props

  const handleRating = (event, { rating }) => {
    API.postRating(currentUser.id, movie.id, rating).then(() => { // change rating in back end
      setUserRating(rating) // change rating in the dom
      reloadCurrentUser() // reload the user to reflect the change in his movies
    })
  }

  const handleWatched = () => // handles the "marked as seen" button
    userRating === null
      ? API.postRating(currentUser.id, movie.id, 0).then(() => {
        setUserRating(0)
        reloadCurrentUser()
      })
      : API.deleteRating(currentUser.id, movie.id).then(() => {
        setUserRating(null)
        reloadCurrentUser()
      })

  useEffect(() => {
    let userMovie
    if (currentUser) { userMovie = currentUser.movies.find(m => m.id === props.movieId) }
    if (userMovie) setUserRating(userMovie.user_rating)
  }, [currentUser, props.movieId])


  if (!movie) return <h1>flixing...</h1>

  return (
    <div className="moviePage">
      <section className='moviePosterColumn'>
        <Image src={
          poster_path
            ? API.posterURL + poster_path
            : API.genericPosterURL
        } inline floated='left' rounded size='huge' className='moviePoster'>
        </Image>
        <Button icon onClick={history.goBack}>
          <Icon name='left arrow' />
        </Button>
        {
          movie.videos.results.length > 0 && <Modal
            trigger={
              <Button color='youtube'>
                <Icon name='youtube' /> Trailer
            </Button>

            }
            basic
            size='small'>
            <Modal.Content className='modalContent'>
              <iframe
                title={movie.title}
                width={`${window.innerWidth * 0.8}`}
                height={`${window.innerHeight * 0.7}`}
                src={`https://www.youtube.com/embed/${movie.videos.results[0].key}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </Modal.Content>
          </Modal>
        }
      </section>
      <section className='movieInfo'>
        <Header as='h1' >{`${title} (${release_date.slice(0, 4)})`}
        </Header>
        <p className='movieCast'>{credits.cast.slice(0, 4).map(actor => actor.name).join(', ')}</p>
        <p className='movieOverview'>{overview}</p>
        <p className='movieGenres'>{genres.map(genre => genre.name).join(', ')}{runtime ? ` – ${runtime}m` : null}</p>
        {/* <p className='movieRuntime'>{runtime ? `${runtime}m` : null}</p> */}

        <Button
          disabled={!currentUser ? true : false}
          onClick={handleWatched}>
          {
            userRating === null
              ? 'Seen it'
              : 'Mark as NOT seen'
          }
        </Button>
        <br />
        <br />
        <Rating
          className='movieRating'
          onRate={handleRating}
          maxRating={5}
          rating={userRating}
          icon='star'
          size='massive'
          clearable
          disabled={!currentUser ? true : false}
        />
      </section>
    </div>
  )
}

export default MovieDetails