import React from 'react'
import { Image, Header, Button, Rating, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import API from '../api/API'

const MovieDetails = props => {
  const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'

  const { id, poster_path, title, release_date, overview, current_user_rating } = props.movie
  const { handleRating, handleWatched, movie, currentUser, history } = props

  return (
    <div className="moviePage">
      <section className='moviePoster'>
        <Image src={
          poster_path
            ? API.posterURL + poster_path
            : genericPosterURL
        } inline floated='left' rounded size='huge' ></Image>
      </section>
      <section className='movieInfo'>
        <Header as='h1' >{`${title} (${release_date.slice(0, 4)})`}</Header>
        <p>{overview}</p>
        <Button
          disabled={!currentUser ? true : false}
          onClick={() => handleWatched(movie)}>
          {
            current_user_rating === null
              ? 'Mark as seen'
              : 'Mark as NOT seen'
          }
        </Button>
        <br />
        <br />
        <Rating
          className='movieRating'
          movieid={id}
          onRate={handleRating}
          maxRating={5}
          // defaultRating={current_user_rating ? current_user_rating : 0}
          rating={current_user_rating ? current_user_rating : 0}
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