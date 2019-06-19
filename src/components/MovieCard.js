import React, { useState, useEffect } from 'react'
import { Card, Image, Rating } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
// import seenSymbol from '../img/seen-symbol.png'
import API from '../api/API'

const posterURL = 'http://image.tmdb.org/t/p/w300'
const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'

const MovieCard = ({ movie, currentUser }) => {
  // const [movie, setMovie] = useState(null)
  // const [userRating, setUserRating] = useState(null)

  // useEffect(() => {
  //   if (movie) setMovie(movie)
  //   if (movie && currentUser) {
  //     const userMovie = currentUser.movies.find(m => m.id === movie.id)
  //     if (userMovie) setUserRating(userMovie.user_rating)
  //   }
  //   currentUser && console.log(currentUser.movies.length)
  // }, [movie, currentUser, movie, userRating])

  // let userMovie
  if (currentUser && movie) {
    // userMovie = currentUser.movies.find(m => m.id === movie.id)
    // console.log(userMovie)
    console.log(currentUser.first_name, movie.title)
  }

  const getMovieRating = () => {

    if (!currentUser || !movie) return 0

    const match = currentUser.movies.find(m => m.id === movie.id)

    return match ? match.user_rating : 0
  }

  return (
    movie && <Card link as={Link} to={`/movies/${movie.id}`}>
      <Image src={movie.poster_path ? posterURL + movie.poster_path : genericPosterURL}
        wrapped
        ui={false} />
      <div>
        {/* <Image className='seenSymbol' src={seenSymbol} wrapped ui={false} /> */}
        <Rating
          className='cardHover'
          size='massive'
          onRate={event => {
            event.stopPropagation()
          }}
          maxRating={5}
          rating={getMovieRating()}
          icon='star'
          clearable>
        </Rating>
      </div>

    </Card>

  )
}

export default MovieCard