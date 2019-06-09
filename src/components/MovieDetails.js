import React, { } from 'react'
import { Image, Header, Button, Rating, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import API from '../api/API'



const MovieDetails = props => {
  const genericPosterURL = 'https://i.pinimg.com/originals/b3/5f/c9/b35fc9dee41f17718303d5a5ea11e0a4.jpg'

  const { poster_path, title, release_date, overview } = props.movie
  const { currentUser, userRating } = props

  const handleRating = (event, { rating }) =>
    API.postRating(currentUser.id, props.movie.id, rating)

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