import React, { useState, useEffect } from 'react'
import { Card, Image, Rating, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import API from '../api/API'

const posterURL = 'http://image.tmdb.org/t/p/w300'
const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'

const MovieCard = ({ movie, currentUser, reloadCurrentUser, inMoviesPage, allowEdit }) => {

  const [userRating, setUserRating] = useState(null)

  useEffect(() => {
    let match
    if (currentUser && movie) { match = currentUser.movies.find(m => m.id === movie.id) }
    if (match) setUserRating(match.user_rating)
  }, [currentUser, movie])

  // const getMovieRating = () => {
  //   if (!currentUser || !movie) return 0
  //   const match = currentUser.movies.find(m => m.id === movie.id)
  //   return match ? match.user_rating : 0
  // }

  const handleRating = (event, { rating }) => {
    setUserRating(rating)
    API.postRating(currentUser.id, movie.id, rating).then(user => {
      reloadCurrentUser() // reload the user to reflect the change in his movies
    })
  }

  const handleWatched = event => {
    if (!currentUser || !allowEdit) return
    event.preventDefault()
    event.stopPropagation()
    if (userRating === null) {
      setUserRating(0)
      API.postRating(currentUser.id, movie.id, 0).then(() => {
        reloadCurrentUser()
      })
    } else {
      setUserRating(null)
      API.deleteRating(currentUser.id, movie.id).then(() => {
        reloadCurrentUser()
      })
    }
  }


  return (
    movie && <Card link as={Link} to={`/movies/${movie.id}`}>
      <Image src={movie.poster_path ? posterURL + movie.poster_path : genericPosterURL}
        wrapped
        ui={false} />
      <div className='allEncompassingDiv'>
        {allowEdit && <Icon
          className='seenIcon'
          onClick={handleWatched}
          name={userRating === null ? 'eye' : 'check square'}
          size={inMoviesPage ? 'big' : 'large'}
          color={userRating !== null ? 'green' : 'black'}
        />}
        <Rating
          className='cardRating'
          size={inMoviesPage ? 'massive' : 'tiny'}
          onRate={(event, otherthings) => {
            event.preventDefault()
            event.stopPropagation()
            handleRating(event, otherthings)
          }}
          maxRating={5}
          rating={userRating}
          icon='star'
          clearable
          disabled={!currentUser || !allowEdit ? true : false}
        >
        </Rating>
      </div>

    </Card>

  )
}

export default MovieCard