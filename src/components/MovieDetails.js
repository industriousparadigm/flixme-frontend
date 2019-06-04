import React from 'react'
import { Image, Header } from 'semantic-ui-react'

const MovieDetails = props => {
  const posterURL = 'http://image.tmdb.org/t/p/w300'

  const { poster_path, title, release_date, overview, vote_average } = props.movie

  return (
    <div className="moviePage">
      <section className='moviePoster'>
        <Image src={posterURL + poster_path} inline ui={false} floated='left' ></Image>
      </section>
      <section className='movieInfo'>
        <Header as='h1' floated='right' >{title}</Header>
        <p>{overview}</p>
      </section>
    </div>
  )
}
    
export default MovieDetails