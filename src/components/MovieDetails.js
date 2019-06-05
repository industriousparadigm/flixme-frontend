import React from 'react'
import { Image, Header, Button, Rating, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


const MovieDetails = props => {
  const posterURL = 'http://image.tmdb.org/t/p/w300'

  const { poster_path, title, release_date, overview, vote_average } = props.movie

  return (
    <div className="moviePage">
      <section className='moviePoster'>
        <Image src={posterURL + poster_path} inline floated='left' rounded size='huge' ></Image>
      </section>
      <section className='movieInfo'>
        <Header as='h1' >{`${title} (${release_date.slice(0, 4)})`}</Header>
        <p>{overview}</p>
        <Button>Mark as seen</Button>
        <br />
        <br />
        <Rating
          className='movieRating'
          maxRating={5}
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