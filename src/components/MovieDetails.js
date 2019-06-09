import React, { useState, useEffect } from 'react'
import { Image, Header, Button, Rating, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


const MovieDetails = props => {
  const posterURL = 'http://image.tmdb.org/t/p/w300'
  const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'
  const rateMovieURL = 'http://localhost:3017/rate_movie'
  const usersURL = 'http://localhost:3017/users'

  const { id, poster_path, title, release_date, overview } = props.movie
  const { currentUser, userRating } = props

  const handleRating = (event, { rating }) => {
    // event.persist()
    postRating(rating)
  }

  const postRating = rating => {
    const data = { movieId: id, userId: currentUser.id, rating }
    fetch(rateMovieURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  console.log(userRating)

  return (
    <div className="moviePage">
      <section className='moviePoster'>
        <Image src={
          poster_path
            ? posterURL + poster_path
            : genericPosterURL
        } inline floated='left' rounded size='huge' ></Image>
      </section>
      <section className='movieInfo'>
        <Header as='h1' >{`${title} (${release_date.slice(0, 4)})`}</Header>
        <p>{overview}</p>
        <Button>Mark as seen</Button>
        <br />
        <br />
        <Rating
          className='movieRating'
          onRate={handleRating}
          maxRating={5}
          defaultRating={userRating}
          icon='star'
          size='massive'
          clearable
        /> <br /> <br />
        <Button icon as={Link} to={`/movies`}>
          <Icon name='left arrow' />
        </Button>
      </section>
    </div>
  )
}

export default MovieDetails