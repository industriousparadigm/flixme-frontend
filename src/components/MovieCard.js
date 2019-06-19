import React, { useState, useEffect } from 'react'
import { Card, Image, Rating } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import seenSymbol from '../img/seen-symbol.png'
import API from '../api/API'

const posterURL = 'http://image.tmdb.org/t/p/w300'
const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'

const MovieCard = ({ movie, currentUser, reloadCurrentUser, inMoviesPage, allowEdit }) => {

  const getMovieRating = () => {
    if (!currentUser || !movie) return 0
    const match = currentUser.movies.find(m => m.id === movie.id)
    return match ? match.user_rating : 0
  }

  const handleRating = (event, { rating }) =>
    API.postRating(currentUser.id, movie.id, rating).then(() => { // change rating in back end
      reloadCurrentUser() // reload the user to reflect the change in his movies
    })



  return (
    movie && <Card link as={Link} to={`/movies/${movie.id}`}>
      <Image src={movie.poster_path ? posterURL + movie.poster_path : genericPosterURL}
        wrapped
        ui={false} />
      <div>
        {/* <Image className='seenSymbol' src={seenSymbol} wrapped ui={false} /> */}
        {
          <Rating
            className='cardHover'
            size={inMoviesPage ? 'massive' : 'tiny'}
            onRate={(event, otherthings) => {
              event.preventDefault()
              event.stopPropagation()
              handleRating(event, otherthings)
            }}
            maxRating={5}
            rating={getMovieRating()}
            icon='star'
            clearable
            disabled={!currentUser || !allowEdit ? true : false}
          >
          </Rating>
        }
      </div>

    </Card>

  )
}

export default MovieCard